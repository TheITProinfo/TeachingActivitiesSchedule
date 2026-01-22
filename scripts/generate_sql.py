import random
from datetime import datetime, timedelta

titles = [
    "Introduction to AI", "Advanced React Patterns", "Database Design Mastery", 
    "Cloud Computing Essentials", "Cybersecurity Basics", "Machine Learning Workshop",
    "Frontend Architecture", "Backend Scalability", "DevOps Best Practices",
    "Mobile App Development", "Data Science with Python", "Neural Networks Deep Dive",
    "UX/UI Principles", "Agile Project Management", "Blockchain Fundamentals",
    "IoT Systems Design", "Natural Language Processing", "Computer Vision Applications",
    "Big Data Analytics", "Serverless Computing", "Microservices Architecture",
    "Graph Database Trends", "WebAssembly Future", "Progressive Web Apps",
    "Rust for Systems Programming", "Go Language Guide", "TypeScript Advanced Types",
    "Kubernetes Operability", "Docker Containerization", "Network Security Protocols",
    "Digital Marketing for Tech", "Product Management 101", "Startup Engineering",
    "Technical Writing Skills", "Public Speaking for Geeks", "Ethics in AI",
    "Quantum Computing Intro", "AR/VR Development", "Game Design Mechanics",
    "Unity engine Basics", "Unreal Engine Advanced", "iOS Swift Programming",
    "Android Kotlin Development", "Flutter Cross-Platform", "React Native Performance",
    "GraphQL vs REST", "API Design Guidelines", "System Design Interview Prep",
    "Algorithm Optimization", "Data Structures Refresher"
]

speakers = [
    "Dr. Alice Smith", "Bob Jones", "Carol White", "David Brown", "Eva Green",
    "Frank Miller", "Grace Lee", "Henry Wilson", "Ivy Chen", "Jack Davis",
    "Kelly Martin", "Liam Taylor", "Mia Anderson", "Noah Thomas", "Olivia Jackson",
    "Paul Moore", "Quinn Hall", "Rachel King", "Sam Wright", "Tina Lopez",
    "Ursula Baker", "Victor Hill", "Wendy Scott", "Xavier Young", "Yvonne Adams",
    "Zachary Nelson", "Dr. Emily Carter", "Prof. John Doe", "Sarah Connor",
    "Michael Scott"
]

locations = [
    "Room 101", "Room 203", "Main Auditorium", "Conference Hall A", "Conference Hall B",
    "Lab 1", "Lab 2", "Online (Zoom)", "Innovation Hub", "Library Meeting Room",
    "Building C, Room 404", "Tech Park, Building 5", "Student Center", "Design Studio"
]

descriptions = [
    "A comprehensive overview of the subject.",
    "Deep dive into advanced concepts and techniques.",
    "Hands-on workshop with real-world examples.",
    "Learn the fundamentals and best practices.",
    "Explore the latest trends and future directions.",
    "Designed for beginners and intermediate learners.",
    "Master the skills needed for the industry.",
    "Practical session with coding exercises.",
    "Theoretical background and practical application.",
    "Case studies and success stories shared."
]

print("INSERT INTO teaching_activities (title, start_time, end_time, location, speaker, description) VALUES")

values = []
start_date = datetime.now() + timedelta(days=1)

for i in range(50):
    title = titles[i % len(titles)]
    speaker = random.choice(speakers)
    location = random.choice(locations)
    desc = descriptions[i % len(descriptions)]
    
    # Randomize time
    day_offset = i * 2 + random.randint(0, 1)
    hour = random.randint(9, 16)
    duration = random.choice([1, 2, 3])
    
    start = start_date + timedelta(days=day_offset)
    start = start.replace(hour=hour, minute=0, second=0, microsecond=0)
    end = start + timedelta(hours=duration)
    
    start_str = start.strftime("%Y-%m-%d %H:%M:%S+00")
    end_str = end.strftime("%Y-%m-%d %H:%M:%S+00")
    
    values.append(f"('{title}', '{start_str}', '{end_str}', '{location}', '{speaker}', '{desc}')")

with open('scripts/seed_data.sql', 'w', encoding='utf-8') as f:
    f.write("INSERT INTO teaching_activities (title, start_time, end_time, location, speaker, description) VALUES\n")
    f.write(",\n".join(values) + ";\n")
