import json
import os
from urllib.parse import parse_qs
import boto3

ses = boto3.client("ses")

def response(status, body):
    return {"statusCode": status, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST,OPTIONS"}, "body": json.dumps(body)}

def lambda_handler(event, context):
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS" or event.get("httpMethod") == "OPTIONS":
        return response(204, {})
    raw_body = event.get("body") or ""
    content_type = (event.get("headers") or {}).get("content-type", "")
    try:
        if "application/x-www-form-urlencoded" in content_type:
            body = {key: values[0] for key, values in parse_qs(raw_body).items()}
        else:
            body = json.loads(raw_body or "{}")
    except (json.JSONDecodeError, ValueError):
        return response(400, {"error": "Invalid request."})
    if body.get("website"):
        return response(200, {"ok": True})
    name = str(body.get("name", "")).strip()
    email = str(body.get("email", "")).strip()
    event_type = str(body.get("event", "")).strip()
    date = str(body.get("date", "")).strip()
    details = str(body.get("details", "")).strip()
    if not name or not email or "@" not in email or not event_type:
        return response(400, {"error": "Please provide your name, email, and event type."})
    subject = f"New RHK Entertainment inquiry from {name}"
    text = f"Name: {name}\nEmail: {email}\nEvent type: {event_type}\nEvent date: {date or 'Not provided'}\n\nDetails:\n{details or 'Not provided'}"
    ses.send_email(Source=os.environ["SENDER_EMAIL"], Destination={"ToAddresses": [os.environ["RECIPIENT_EMAIL"]]}, Message={"Subject": {"Data": subject}, "Body": {"Text": {"Data": text}}})
    return response(200, {"ok": True})
