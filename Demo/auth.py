from flask import Blueprint, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import re

# Initialize Blueprint
contact_bp = Blueprint('contact', __name__, template_folder='templates')

db = SQLAlchemy()
mail = Mail()

# Contact Model
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    message = db.Column(db.Text, nullable=False)

@contact_bp.route('/contact', methods=['GET', 'POST'])
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
