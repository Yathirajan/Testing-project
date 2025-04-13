# AI-Powered Hackathon Chatbot

An intelligent chatbot designed to enhance the hackathon experience by answering questions, suggesting project ideas, and helping teams find members with complementary skills.

## Features

- **AI-Powered Chat**: Get answers to common hackathon questions
- **Project Idea Suggestions**: Explore trending hackathon project ideas
- **Team Matching**: Find team members with complementary skills

## Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML, CSS, JavaScript
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome

## Installation & Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd hackathon-chatbot
   ```

2. Set up a Python virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install flask python-dotenv
   ```

4. Run the application:
   ```
   python app.py
   ```

5. Open a web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
hackathon-chatbot/
├── app.py                 # Main Flask application
├── data/                  # Data storage
│   └── hackathon_data.json # Default hackathon data
├── static/                # Static assets
│   ├── css/
│   │   └── style.css      # Application styling
│   └── js/
│       └── script.js      # Client-side functionality
└── templates/             # HTML templates
    └── index.html         # Main application page
```

## Customization

### Adding More Project Ideas

Edit the `data/hackathon_data.json` file to add more project ideas in the following format:

```json
{
  "name": "Project Name",
  "description": "Project description",
  "skills": ["Skill1", "Skill2", "Skill3"]
}
```

### Extending Chatbot Knowledge

To add more questions and answers to the chatbot, edit the `common_questions` section in the `data/hackathon_data.json` file.

## Future Enhancements

- Integration with natural language processing for more advanced chat capabilities
- User authentication and profiles
- Team formation and management features
- Integration with popular hackathon platforms
- Real-time chat between team members

## License

MIT

## Contributors

- Yathirajan
