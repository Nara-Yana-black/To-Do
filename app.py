from flask import Flask, render_template, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

app = Flask(__name__)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/todoDB"
mongo = PyMongo(app)

# Route to serve the homepage (index.html)
@app.route('/')
def index():
    return render_template('index.html')

# Add Task
@app.route('/add_task', methods=['POST'])
def add_task():
    task = request.json
    task['completed'] = False  # Default completion status
    task_id = mongo.db.tasks.insert_one(task).inserted_id
    task['_id'] = str(task_id)  # Convert ObjectId to string
    return jsonify(task), 201

# Get Tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = mongo.db.tasks.find()
    return jsonify([{
        '_id': str(task['_id']),
        'title': task['title'],
        'description': task['description'],
        'completed': task['completed']
    } for task in tasks])

# Rename Task
@app.route('/rename_task/<task_id>', methods=['PUT'])
def rename_task(task_id):
    new_title = request.json.get('title')
    mongo.db.tasks.update_one({'_id': ObjectId(task_id)}, {'$set': {'title': new_title}})
    updated_task = mongo.db.tasks.find_one({'_id': ObjectId(task_id)})
    updated_task['_id'] = str(updated_task['_id'])
    return jsonify(updated_task)

# Edit Description
@app.route('/edit_description/<task_id>', methods=['PUT'])
def edit_description(task_id):
    new_description = request.json.get('description')
    mongo.db.tasks.update_one({'_id': ObjectId(task_id)}, {'$set': {'description': new_description}})
    updated_task = mongo.db.tasks.find_one({'_id': ObjectId(task_id)})
    updated_task['_id'] = str(updated_task['_id'])
    return jsonify(updated_task)

# Delete Task
@app.route('/delete_task/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    mongo.db.tasks.delete_one({'_id': ObjectId(task_id)})
    return jsonify({"message": "Task deleted successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
