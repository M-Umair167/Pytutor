from flask import Flask, request, render_template, redirect, session
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import re
import bcrypt

# database connection

DB_NAME = "demo"
DB_USER = "postgres"
DB_PASS = "admin"
DB_HOST = "localhost"
DB_PORT = "5432"

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
db = SQLAlchemy(app)
mail = Mail()
app.secret_key = 'secret_key'

# table creation for login or signup 
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

    def __init__(self,name,email,password):
        self.name = name
        self.email = email
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self,password):
        return bcrypt.checkpw(password.encode('utf-8'),self.password.encode('utf-8'))

# Contact Model
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    message = db.Column(db.Text, nullable=False)
    
with app.app_context():
    db.create_all()

# preview page 
@app.route('/')
def preview():
    return render_template('preview.html')


# signup page 
@app.route('/signup.html')
def signup_html():
    return redirect('/signup')

@app.route('/signup',methods=['GET','POST'])
def signup():
    if request.method == 'POST':
        # handle request
        name = request.form['name'].strip()
        email = request.form['email'].strip()
        password = request.form['password']

        # Validation
        if not name or not email or not password:
            return render_template('signup.html', error='All fields are required.')
        if len(password) < 6:
            return render_template('signup.html', error='Password must be at least 6 characters.')
        if User.query.filter_by(email=email).first():
            return render_template('signup.html', error='Email is already registered.')

        new_user = User(name=name,email=email,password=password)
        db.session.add(new_user)
        db.session.commit()
        return redirect('/login')
    
    return render_template('signup.html')


# login page 
@app.route('/login.html')
def login_html():
    return redirect('/login')

@app.route('/login',methods=['GET','POST'])
def login():
    if request.method == 'POST':
        email = request.form['email'].strip()
        password = request.form['password']

        # Validation
        if not email or not password:
            return render_template('login.html', error='All fields are required.')

        user = User.query.filter_by(email=email).first()
        
        if not user:
            return render_template('login.html', error='Invalid user')
        elif not user.check_password(password):
            return render_template('login.html', error='Incorrect password')
        else:
            session['email'] = user.email
            return redirect('/index')

    return render_template('login.html')


# index page 
@app.route('/index.html')
def index_html():
    return redirect('/index')

# @app.route('/index')
@app.route('/index')
def index():
    user = None
    if 'email' in session:
        user = User.query.filter_by(email=session['email']).first()
    return render_template('index.html', user=user)



# about page 
@app.route('/about.html')
def about_html():
    print(session)  # Check what's stored in session
    return render_template('about.html')


# contact page 
@app.route('/contact.html')
def contact_html():
    return render_template('contact.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name'].strip()
        email = request.form['email'].strip()
        phone = request.form.get('phone', '').strip()
        message_text = request.form['message'].strip()

        # Validation
        name_pattern = r'^[a-zA-Z. ]+$'
        email_pattern = r'^[^@]+@[^@]+\.[a-zA-Z]{2,6}$'

        if not re.match(name_pattern, name):
            return render_template('contact.html', error="Name must contain only letters and dot.")
        if not re.match(email_pattern, email):
            return render_template('contact.html', error="Invalid email format.")
        if not message_text:
            return render_template('contact.html', error="Message cannot be empty.")

        new_contact = Contact(name=name, email=email, phone=phone, message=message_text)
        db.session.add(new_contact)
        db.session.commit()

        # Send email to admin
        try:
            msg = Message("New Contact Submission", recipients=["umairbwp202@gmail.com"])
            msg.body = f"Name: {name}\nEmail: {email}\nPhone: {phone}\n\nMessage:\n{message_text}"
            mail.send(msg)
        except Exception as e:
            print("Failed to send email:", e)

        return render_template('contact.html', success="Message sent successfully!")

    return render_template('contact.html')

# tutorials page 
@app.route('/tutorials.html')
def tutorials_html():
    print(session)  # Check what's stored in session
    return render_template('tutorials.html')


# chatbot page 
@app.route('/chatbot.html')
def chatbot_html():
    print(session)  # Check what's stored in session
    return render_template('chatbot.html')

# compiler page 
@app.route('/compiler.html')
def compiler_html():
    print(session)  # Check what's stored in session
    return render_template('compiler.html')

@app.route('/logout')
def logout():
    session.pop('email',None)
    return redirect('/index')

if __name__ == '__main__':
    app.run(debug=True)


