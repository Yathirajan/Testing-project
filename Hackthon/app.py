from flask import Flask, render_template, request, jsonify
import json
import random
import os
from datetime import datetime

app = Flask(__name__)

# Load hackathon data
def load_data():
    try:
        with open('data/hackathon_data.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # Return default data if file doesn't exist or is invalid
        return {
            "common_questions": {
                "what_is_hackathon": "A hackathon is a sprint-like event where programmers, designers, and others collaborate intensively on software projects.",
                "how_to_prepare": "Prepare by forming a team, brainstorming ideas, reviewing the theme, and setting up your development environment ahead of time.",
                "winning_tips": "Focus on solving a real problem, creating a working prototype, preparing a compelling pitch, and demonstrating business potential."
            },
            "project_ideas": [
                {"name": "Health Monitoring App", "description": "App to track health metrics and provide insights.", "skills": ["Mobile Dev", "AI", "Healthcare"]},
                {"name": "Sustainable Energy Platform", "description": "Platform to monitor and optimize energy consumption.", "skills": ["IoT", "Data Science", "Web Dev"]},
                {"name": "AR Learning Tool", "description": "Augmented reality tool for interactive learning.", "skills": ["AR/VR", "Education", "Mobile Dev"]},
                {"name": "Smart City Solution", "description": "IoT system for urban infrastructure management.", "skills": ["IoT", "Cloud", "Data Science"]}
            ],
            "skills_categories": ["Web Dev", "Mobile Dev", "AI/ML", "Data Science", "IoT", "Cloud", "AR/VR", "Blockchain", "UI/UX", "Cybersecurity"]
        }

# Initialize hackathon data
hackathon_data = load_data()

# Ensure data directory exists
os.makedirs('data', exist_ok=True)

# Save any changes to data
def save_data():
    with open('data/hackathon_data.json', 'w') as f:
        json.dump(hackathon_data, f, indent=4)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '').lower()
    
    # Simple response logic
    if 'what is a hackathon' in user_message:
        response = hackathon_data["common_questions"]["what_is_hackathon"]
    elif 'how to prepare' in user_message:
        response = hackathon_data["common_questions"]["how_to_prepare"]
    elif 'tips to win' in user_message or 'winning tips' in user_message:
        response = hackathon_data["common_questions"]["winning_tips"]
    elif 'project idea' in user_message or 'suggest project' in user_message:
        # Suggest random project ideas
        ideas = random.sample(hackathon_data["project_ideas"], min(2, len(hackathon_data["project_ideas"])))
        response = "Here are some project ideas:\n"
        for idea in ideas:
            response += f"- {idea['name']}: {idea['description']} (Skills: {', '.join(idea['skills'])})\n"
    elif 'find team' in user_message or 'team member' in user_message:
        response = "To find team members, consider:\n- Posting in the hackathon's Slack/Discord channel\n- Networking during the opening ceremony\n- Specifying the skills you're looking for\n- Joining team formation events"
    elif 'hello' in user_message or 'hi' in user_message:
        response = "Hello! I'm your Hackathon Assistant. How can I help you today?"
    else:
        response = "I'm not sure how to help with that. Try asking about hackathon preparation, project ideas, or finding team members."
    
    return jsonify({
        "response": response,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

@app.route('/api/skills', methods=['GET'])
def get_skills():
    return jsonify(hackathon_data["skills_categories"])

@app.route('/api/project-ideas', methods=['GET'])
def get_project_ideas():
    return jsonify(hackathon_data["project_ideas"])

@app.route('/api/team-matching', methods=['POST'])
def team_matching():
    # In a real app, this would match users based on skills and interests
    user_skills = request.json.get('skills', [])
    available_skills = set(hackathon_data["skills_categories"])
    
    if not user_skills or not set(user_skills).intersection(available_skills):
        return jsonify({
            "success": False,
            "message": "Please provide valid skills for matching"
        })
    
    # Simulate finding team members
    recommended_skills = list(available_skills - set(user_skills))
    random.shuffle(recommended_skills)
    
    return jsonify({
        "success": True,
        "recommended_skills": recommended_skills[:3],
        "message": "Based on your skills, we recommend finding team members with these complementary skills"
    })

if __name__ == '__main__':
    app.run(debug=True) 