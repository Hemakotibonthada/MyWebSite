// database/seeds/seedData.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../backend/models/User");
const Device = require("../../backend/models/Device");
const Course = require("../../backend/models/Course");
const Chat = require("../../backend/models/Chat");
const Job = require("../../backend/models/Job");
require("dotenv").config();

// Connect to Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

// Seed Users
const seedUsers = async () => {
    const password = await bcrypt.hash("password123", 10);
    const users = [
        {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            password_hash: password,
            phone: "123-456-7890",
        },
        {
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com",
            password_hash: password,
            phone: "987-654-3210",
        },
    ];

    await User.insertMany(users);
    console.log("Users seeded successfully!");
};

// Seed Devices
const seedDevices = async () => {
    const users = await User.find();
    const devices = [
        { user_id: users[0]._id, serial_number: "SN001", name: "Light Control", model: "Smart Light" },
        { user_id: users[1]._id, serial_number: "SN002", name: "Thermostat", model: "Smart Thermostat" },
    ];

    await Device.insertMany(devices);
    console.log("Devices seeded successfully!");
};

// Seed Courses
const seedCourses = async () => {
    const users = await User.find();
    const courses = [
        {
            title: "IoT Device Management",
            description: "Learn how to manage and monitor IoT devices effectively.",
            category: "IoT",
            created_by: users[0]._id,
            modules: [
                { title: "Introduction to IoT", type: "Video", contentUrl: "http://example.com/intro" },
                { title: "Device Setup", type: "PDF", contentUrl: "http://example.com/setup.pdf" },
            ],
        },
        {
            title: "React Development",
            description: "Master React.js for building web applications.",
            category: "Development",
            created_by: users[1]._id,
            modules: [
                { title: "Getting Started", type: "Article", contentUrl: "http://example.com/start" },
            ],
        },
    ];

    await Course.insertMany(courses);
    console.log("Courses seeded successfully!");
};

// Seed Jobs
const seedJobs = async () => {
    const users = await User.find();
    const jobs = [
        {
            title: "Full-Stack Developer",
            company: "Tech Solutions Inc.",
            location: "Remote",
            job_type: "Full-Time",
            description: "Develop and maintain scalable web applications.",
            posted_by: users[0]._id,
        },
        {
            title: "IoT Engineer",
            company: "SmartTech",
            location: "On-Site",
            job_type: "Part-Time",
            description: "Design and implement IoT solutions.",
            posted_by: users[1]._id,
        },
    ];

    await Job.insertMany(jobs);
    console.log("Jobs seeded successfully!");
};

// Seed Chats
const seedChats = async () => {
    const users = await User.find();
    const chats = [
        {
            is_group: false,
            name: "John and Jane",
            created_by: users[0]._id,
            participants: [users[0]._id, users[1]._id],
            messages: [
                {
                    sender_id: users[0]._id,
                    content: "Hello Jane!",
                    message_type: "text",
                },
                {
                    sender_id: users[1]._id,
                    content: "Hi John!",
                    message_type: "text",
                },
            ],
        },
    ];

    await Chat.insertMany(chats);
    console.log("Chats seeded successfully!");
};

// Seed Data Execution
const seedData = async () => {
    await connectDB();
    await mongoose.connection.db.dropDatabase();
    console.log("Database cleared!");

    await seedUsers();
    await seedDevices();
    await seedCourses();
    await seedJobs();
    await seedChats();

    console.log("All data seeded successfully!");
    process.exit();
};

seedData();