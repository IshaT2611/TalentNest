# /public/notifications/getNotifications.py

import json
import sys

def recommend_notifications(skills):
    with open('public/notifications/skills_data.json', 'r') as file:
        data = json.load(file)

    notifications = []
    for skill in skills:
        skill = skill.lower()
        if skill in data:
            notifications.extend(data[skill])
    
    return notifications

if __name__ == "__main__":
    # Accept skills from Node.js via command line
    skills_input = sys.argv[1]  # e.g. "python,cybersecurity"
    skills_list = [skill.strip() for skill in skills_input.split(',')]
    
    recommended = recommend_notifications(skills_list)
    print(json.dumps(recommended))
