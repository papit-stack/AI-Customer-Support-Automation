"""Seed the database with sample email drafts for testing the dashboard."""
import random
from datetime import datetime, timedelta, timezone
from app.database import SessionLocal, engine, Base

# Ensure tables exist
Base.metadata.create_all(bind=engine)

SAMPLE_DRAFTS = [
    {
        "customer_name": "Alice Johnson",
        "customer_email": "alice.johnson@email.com",
        "subject": "Where is my order #12345?",
        "customer_message": "Hi, I placed order #12345 three days ago and haven't received any shipping update. Can you check the status?",
        "ai_reply": "Hi Alice,\n\nThank you for reaching out. Your order #12345 was shipped on January 22nd via FedEx and is expected to arrive by January 26th. Your tracking number is FX-987654321.\n\nPlease let us know if you have any other questions.\n\nBest regards,\nCustomer Support Team",
        "intent": "order_status",
    },
    {
        "customer_name": "Bob Martinez",
        "customer_email": "bob.martinez@email.com",
        "subject": "Refund request for defective product",
        "customer_message": "I received a broken glass set. I want a full refund immediately. Order #54321.",
        "ai_reply": "Hi Bob,\n\nWe sincerely apologize for the inconvenience. We've verified your order #54321 and can confirm the item arrived damaged.\n\nWe've initiated a full refund of $49.99 to your original payment method. Please allow 3-5 business days for the refund to appear.\n\nYou may also request a replacement at no additional cost if you prefer.\n\nBest regards,\nCustomer Support Team",
        "intent": "refund_request",
    },
    {
        "customer_name": "Carol White",
        "customer_email": "carol.white@email.com",
        "subject": "Question about wireless headphones",
        "customer_message": "Do your wireless headphones support Bluetooth 5.3? Also, what is the battery life?",
        "ai_reply": "Hi Carol,\n\nGreat question! Our ProSound X3 wireless headphones feature Bluetooth 5.3 with multipoint connectivity. Battery life is up to 40 hours on a single charge with ANC enabled, and 60 hours with ANC off.\n\nWould you like me to help you with anything else?\n\nBest regards,\nCustomer Support Team",
        "intent": "product_inquiry",
    },
    {
        "customer_name": "David Kim",
        "customer_email": "david.kim@email.com",
        "subject": "Looking for a laptop recommendation",
        "customer_message": "I need a laptop for video editing under $1500. Any suggestions?",
        "ai_reply": "Hi David,\n\nBased on your budget and needs, I'd recommend:\n\n1. MacBook Air M3 ($1,299) - Excellent for Final Cut Pro\n2. ASUS ProArt Studiobook ($1,399) - Great GPU for rendering\n3. Dell XPS 15 ($1,449) - Solid all-rounder with OLED display\n\nAll three handle 4K video editing smoothly. Would you like detailed specs for any of these?\n\nBest regards,\nCustomer Support Team",
        "intent": "product_recommendation",
    },
    {
        "customer_name": "Emma Davis",
        "customer_email": "emma.davis@email.com",
        "subject": "Terrible customer service experience",
        "customer_message": "I've been waiting 2 weeks for my refund. Nobody responds to my emails. This is unacceptable!",
        "ai_reply": "Dear Emma,\n\nWe deeply apologize for the delay and frustration you've experienced. This is not the standard of service we aim to provide.\n\nI've escalated your case to our senior support team. Your refund of $89.99 has been processed immediately and will appear in your account within 1-2 business days.\n\nAs a gesture of goodwill, we've also added a $20 store credit to your account.\n\nSincerely,\nCustomer Support Team",
        "intent": "complaint",
    },
    {
        "customer_name": "Frank Brown",
        "customer_email": "frank.brown@email.com",
        "subject": "How do I reset my password?",
        "customer_message": "I can't log in to my account. How do I reset my password?",
        "ai_reply": "Hi Frank,\n\nTo reset your password:\n\n1. Go to our login page at app.example.com/login\n2. Click \"Forgot Password\"\n3. Enter your email address\n4. Check your inbox for the reset link\n5. Click the link and create a new password\n\nThe reset link expires in 24 hours. If you need further assistance, let us know.\n\nBest regards,\nCustomer Support Team",
        "intent": "faq",
    },
    {
        "customer_name": "Grace Lee",
        "customer_email": "grace.lee@email.com",
        "subject": "International shipping available?",
        "customer_message": "Do you ship to South Korea? What are the shipping costs?",
        "ai_reply": "Hi Grace,\n\nYes, we ship internationally to South Korea! Shipping rates:\n\n- Standard (7-14 days): $12.99\n- Express (3-5 days): $29.99\n- Free shipping on orders over $100\n\nPlease note that customs duties may apply based on your local regulations.\n\nBest regards,\nCustomer Support Team",
        "intent": "product_inquiry",
    },
    {
        "customer_name": "Henry Wilson",
        "customer_email": "henry.wilson@email.com",
        "subject": "Late delivery complaint",
        "customer_message": "My package was supposed to arrive last week. Still nothing. This is the second time this has happened.",
        "ai_reply": "Dear Henry,\n\nWe sincerely apologize for the repeated delivery issues. We understand how frustrating this must be.\n\nI've contacted our logistics partner to investigate. Your package is currently at the local distribution center and will be delivered within 24 hours.\n\nTo prevent future issues, I've flagged your account for priority handling on all future orders.\n\nBest regards,\nCustomer Support Team",
        "intent": "complaint",
    },
    {
        "customer_name": "Iris Chen",
        "customer_email": "iris.chen@email.com",
        "subject": "Order status update needed",
        "customer_message": "Hi, can you check if order #67890 has been shipped yet?",
        "ai_reply": "Hi Iris,\n\nI've checked your order #67890. It was processed and shipped yesterday via UPS (tracking: 1Z999AA10123456784).\n\nEstimated delivery: January 27th.\n\nYou can track your package at ups.com/track.\n\nBest regards,\nCustomer Support Team",
        "intent": "order_status",
    },
    {
        "customer_name": "Jack Thompson",
        "customer_email": "jack.thompson@email.com",
        "subject": "Want to return a gift",
        "customer_message": "I received a smartwatch as a gift but I already have one. Can I return it without a receipt?",
        "ai_reply": "Hi Jack,\n\nYes, we accept gift returns without a receipt! Here's what you need:\n\n1. The item must be in original packaging\n2. Return within 30 days of delivery\n3. You'll receive store credit for the item's current price ($199.99)\n\nTo start the return, reply to this email and we'll send you a prepaid return label.\n\nBest regards,\nCustomer Support Team",
        "intent": "refund_request",
    },
    {
        "customer_name": "Karen Adams",
        "customer_email": "karen.adams@email.com",
        "subject": "Recommendation for running shoes",
        "customer_message": "I need running shoes for marathon training. I pronate slightly. Budget around $200.",
        "ai_reply": "Hi Karen,\n\nFor marathon training with mild pronation, I'd recommend:\n\n1. ASICS Gel-Kayano 30 ($160) - Top stability shoe, excellent cushioning\n2. Brooks Adrenaline GTS 23 ($140) - Great balance of support and comfort\n3. New Balance Fresh Foam X 860v13 ($140) - Durable with medial post\n\nThe ASICS Kayano is our most popular choice for marathon runners with your needs. Would you like to place an order?\n\nBest regards,\nCustomer Support Team",
        "intent": "product_recommendation",
    },
    {
        "customer_name": "Leo Garcia",
        "customer_email": "leo.garcia@email.com",
        "subject": "Damaged item received",
        "customer_message": "The coffee table I ordered arrived with a big scratch on the surface. Order #98765.",
        "ai_reply": "Hi Leo,\n\nWe're sorry to hear about the damage to your coffee table. We take product quality seriously.\n\nI've initiated a replacement shipment that will arrive within 5-7 business days. No need to return the damaged item.\n\nAdditionally, we've issued a $30 discount code (SORRY30) for your next purchase.\n\nBest regards,\nCustomer Support Team",
        "intent": "complaint",
    },
    {
        "customer_name": "Mia Rodriguez",
        "customer_email": "mia.rodriguez@email.com",
        "subject": "Subscription cancellation",
        "customer_message": "I want to cancel my monthly subscription. I've been charged twice this month.",
        "ai_reply": "Hi Mia,\n\nWe've processed your subscription cancellation immediately - no further charges will be made.\n\nRegarding the double charge, I've verified your account and confirmed the error. A refund of $14.99 has been issued and will appear in 3-5 business days.\n\nWe're sorry for the inconvenience. If you'd ever like to resubscribe, we'll offer you a 20% discount.\n\nBest regards,\nCustomer Support Team",
        "intent": "refund_request",
    },
    {
        "customer_name": "Noah Patel",
        "customer_email": "noah.patel@email.com",
        "subject": "Product compatibility question",
        "customer_message": "Is the X200 charger compatible with iPhone 15 and Samsung S24?",
        "ai_reply": "Hi Noah,\n\nYes! The X200 charger is fully compatible with both devices:\n\n- iPhone 15: Up to 27W fast charging via USB-C\n- Samsung S24: Up to 25W fast charging via USB-C PD\n\nIt also features dual ports so you can charge both simultaneously.\n\nBest regards,\nCustomer Support Team",
        "intent": "faq",
    },
    {
        "customer_name": "Olivia Scott",
        "customer_email": "olivia.scott@email.com",
        "subject": "Bulk order inquiry",
        "customer_message": "We need 50 wireless keyboards for our office. Do you offer bulk pricing?",
        "ai_reply": "Hi Olivia,\n\nThank you for your interest in a bulk order! We do offer volume discounts:\n\n- 25-49 units: 10% off ($53.99 each)\n- 50-99 units: 15% off ($50.99 each)\n- 100+ units: 20% off ($47.99 each)\n\nFor an order of 50 keyboards, your total would be $2,549.50 (saving $225).\n\nI can prepare a formal quote if you'd like. What's your preferred delivery timeline?\n\nBest regards,\nCustomer Support Team",
        "intent": "product_inquiry",
    },
    {
        "customer_name": "Paul Turner",
        "customer_email": "paul.turner@email.com",
        "subject": "Refund not received",
        "customer_message": "I was promised a refund 10 days ago for order #11111. It still hasn't appeared in my bank account.",
        "ai_reply": "Dear Paul,\n\nI sincerely apologize for the delay. Let me investigate this immediately.\n\nAfter reviewing your case, I can see the refund was processed on January 15th but there was a banking system delay. I've escalated this with our payment processor and the refund of $79.99 will appear in your account within 24-48 hours.\n\nI'll personally follow up to ensure this is resolved.\n\nBest regards,\nCustomer Support Team",
        "intent": "complaint",
    },
    {
        "customer_name": "Quinn Foster",
        "customer_email": "quinn.foster@email.com",
        "subject": "Gift card balance check",
        "customer_message": "How do I check my gift card balance? The code is GC-XXXX-YYYY.",
        "ai_reply": "Hi Quinn,\n\nYou can check your gift card balance in two ways:\n\n1. Online: Go to example.com/giftcard and enter your code\n2. Phone: Call 1-800-XXX-XXXX and provide your code\n\nI've also checked for you - your gift card balance is $67.50.\n\nBest regards,\nCustomer Support Team",
        "intent": "faq",
    },
    {
        "customer_name": "Rachel Green",
        "customer_email": "rachel.green@email.com",
        "subject": "Wrong item shipped",
        "customer_message": "I ordered a blue jacket but received a red sweater instead. Order #22222.",
        "ai_reply": "Hi Rachel,\n\nWe're sorry about this mix-up! I've arranged for the correct item (blue jacket) to be shipped to you immediately via express delivery (1-2 days).\n\nFor the wrong item received, we'll include a prepaid return label in your package - just drop it off at your convenience.\n\nAs an apology, here's a 15% discount code: SORRY15.\n\nBest regards,\nCustomer Support Team",
        "intent": "complaint",
    },
    {
        "customer_name": "Sam Cooper",
        "customer_email": "sam.cooper@email.com",
        "subject": "Warranty claim",
        "customer_message": "My headphones stopped working after 8 months. Are they still under warranty?",
        "ai_reply": "Hi Sam,\n\nYes, your headphones are covered under our 1-year warranty!\n\nTo process your warranty claim:\n\n1. I've sent a warranty claim form to your email\n2. Once completed, we'll ship a replacement within 3 business days\n3. You'll receive a prepaid label to return the defective pair\n\nNo receipt needed - we have your purchase on record from May 2025.\n\nBest regards,\nCustomer Support Team",
        "intent": "refund_request",
    },
    {
        "customer_name": "Tina Murphy",
        "customer_email": "tina.murphy@email.com",
        "subject": "Delivery address change",
        "customer_message": "I just placed order #33333 but need to change the delivery address. Can you help?",
        "ai_reply": "Hi Tina,\n\nI've updated the delivery address for order #33333 to your new address on file.\n\nNew delivery address:\n123 Main Street, Apt 4B\nNew York, NY 10001\n\nPlease confirm this is correct by replying to this email. The change will be finalized once confirmed.\n\nBest regards,\nCustomer Support Team",
        "intent": "order_status",
    },
]


def seed_database():
    db = SessionLocal()
    try:
        existing_count = db.query(
            __import__("app.models", fromlist=["EmailDraft"]).EmailDraft
        ).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} drafts. Skipping seed.")
            return

        from app.models import EmailDraft

        statuses = ["Pending", "Approved", "Sent", "Rejected", "Edited"]
        weights = [0.30, 0.25, 0.30, 0.10, 0.05]

        for i, draft_data in enumerate(SAMPLE_DRAFTS):
            status = random.choices(statuses, weights=weights, k=1)[0]
            created = datetime.now(timezone.utc) - timedelta(days=random.randint(0, 7))
            approved_at = None
            if status in ("Approved", "Sent"):
                approved_at = created + timedelta(hours=random.randint(1, 12))

            draft = EmailDraft(
                thread_id=f"thread-{1000 + i}",
                customer_email=draft_data["customer_email"],
                customer_name=draft_data["customer_name"],
                subject=draft_data["subject"],
                customer_message=draft_data["customer_message"],
                ai_reply=draft_data["ai_reply"],
                intent=draft_data["intent"],
                status=status,
                created_at=created,
                approved_at=approved_at,
            )
            db.add(draft)

        db.commit()
        print(f"Successfully seeded {len(SAMPLE_DRAFTS)} email drafts.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
