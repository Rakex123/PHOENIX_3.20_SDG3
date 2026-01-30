# **App Name**: WellSpring

## Core Features:

- Journal Entry: Allow students to create daily journal entries via text input.
- Sentiment Analysis: Analyze journal entry for overall sentiment: positive, negative, or neutral.
- Emotion Detection: Detect dominant emotions expressed: sadness, anxiety, stress, anger, loneliness, hope. The tool will also analyze indicators of distress or hopelessness (low, medium, high).
- Risk Scoring: Assign a Wellness Risk Score (0-100) based on sentiment and emotion analysis, with associated risk levels (Emotionally stable, Mild distress, High distress, Critical distress).
- Personalized Response Generation: Generate a calm, empathetic, and supportive response to the student, encouraging healthy coping strategies without diagnosing or validating harmful thoughts. The LLM tool will not respond to requests outside the bounds of the allowed data, and only to journal data from the specific user.
- Resource Recommendations: Provide access to resources and trusted support networks like school counselors when a high risk level is detected, while avoiding alarming tones.
- Data persistence: Allow to save user data in Firestore database.

## Style Guidelines:

- Primary color: Gentle sky blue (#87CEEB), fostering calmness and tranquility.
- Background color: Very light grayish-blue (#F0F8FF) creating a soft, supportive atmosphere.
- Accent color: Soft lavender (#E6E6FA), complementing blue to inspire balance and reflection.
- Font: 'PT Sans', a humanist sans-serif that balances a modern aesthetic with an inviting feel; good for both headlines and body.
- Use gentle, supportive icons representing emotions (e.g., calm wave for peace, sprouting seed for growth), conveying visual reassurance.
- Use a clean, minimalist layout with generous white space, promoting clarity and emotional openness.
- Incorporate subtle transitions and animations to avoid abruptness and create a nurturing user experience.