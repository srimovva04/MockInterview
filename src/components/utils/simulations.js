// utils/simulations.js
import { supabase } from './supabaseClient';

// Fetch all simulations
export async function fetchSimulations() {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching simulations:', error.message);
    return [];
  }
  return data;
}

// Fetch tasks for a specific simulation
export async function fetchTasksForSimulation(simulationId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('simulation_id', simulationId)
    .order('id', { ascending: true });

  if (error) {
    console.error(`Error fetching tasks for simulation ${simulationId}:`, error.message);
    return [];
  }
  return data;
}



// export const simulations = [
//   {
//     id: 1,
//     company: "Tata Group",
//     title: "Data Visualisation: Empowering Business with Effective Insights",
//     description: "Gain insights into leveraging data visualisations as a tool for making informed business decisions.",
//     category: "Data",
//     difficulty: "Intermediate",
//     duration: "3-4 hours",
//     rating: "7050+ 5 Star Reviews",
//     isFree: true,
//     isNew: false,
//     image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
//     overview: "A risk-free way to experience work on the job with us at Tata Group. Practice your skills with example tasks and build your confidence to ace your applications.",
//     features: ["Self-paced 3-4 hours", "No grades", "No assessments", "Intermediate level"],
//     aboutCompany: "Tata Group is a global conglomerate which operates in more than 100 countries across six continents...",
//     skills: ["Visualisation", "Data Analysis", "Data Interpretation", "Charts & Graphs", "Dashboard", "Effective Communication"],
//     tasks: [
//       {
//         id: 1,
//         title: "Task One",
//         fullTitle: "Task One: Framing the Business Scenario",
//         duration: "30-60 mins",
//         difficulty: "Intermediate",
//         description: "Anticipate business questions your leaders will need answers to",
//         whatYoullLearn: ["Business perspective thinking", "Meeting preparation for senior leaders"],
//         whatYoullDo: ["Write relevant questions for the CEO and CMO"]
//       },
//       {
//         id: 2,
//         title: "Task Two",
//         fullTitle: "Task Two: Choosing the Right Visuals",
//         duration: "45-75 mins",
//         difficulty: "Intermediate",
//         description: "Select appropriate visualizations for different data types",
//         whatYoullLearn: ["Types of charts", "Matching visualization to insights"],
//         whatYoullDo: ["Create visualizations", "Justify visualization choices"]
//       },
//       {
//         id: 3,
//         title: "Task Three",
//         fullTitle: "Task Three: Creating Effective Dashboards",
//         duration: "60-90 mins",
//         difficulty: "Advanced",
//         description: "Build dashboards that tell a compelling story",
//         whatYoullLearn: ["Dashboard design", "Narrative flow"],
//         whatYoullDo: ["Design a dashboard", "Present findings"]
//       },
//       {
//         id: 4,
//         title: "Task Four",
//         fullTitle: "Task Four: Presenting to Stakeholders",
//         duration: "30-45 mins",
//         difficulty: "Intermediate",
//         description: "Communicate data insights to stakeholders",
//         whatYoullLearn: ["Tailoring messages", "Storytelling with data"],
//         whatYoullDo: ["Create materials", "Deliver key insights"]
//       }
//     ]
//   },
//   {
//     id: 2,
//     company: "Tata Group",
//     title: "GenAI: Revolutionizing Data Analytics and Intelligent Automation",
//     description: "Explore how GenAI transforms data analytics and automation.",
//     category: "Data",
//     difficulty: "Intermediate",
//     duration: "3-4 hours",
//     rating: "5000+ 5 Star Reviews",
//     isFree: true,
//     isNew: true,
//     image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
//     overview: "Experience GenAI-driven projects using real business scenarios.",
//     features: ["AI scenarios", "Hands-on learning", "Resume-worthy output"],
//     aboutCompany: "Tata Group leverages GenAI to build the next generation of intelligent systems.",
//     skills: ["GenAI", "Prompt Engineering", "AI Automation", "Data Strategy", "Ethical AI"],
//     tasks: [
//       {
//         id: 1,
//         title: "Task One",
//         fullTitle: "Prompt Engineering Basics",
//         duration: "30 mins",
//         difficulty: "Intermediate",
//         description: "Understand prompt formulation and its impact on results.",
//         whatYoullLearn: ["Crafting effective prompts", "Understanding token usage"],
//         whatYoullDo: ["Write prompts for a chatbot", "Analyze output"]
//       },
//       {
//         id: 2,
//         title: "Task Two",
//         fullTitle: "Using AI for Data Cleanup",
//         duration: "45 mins",
//         difficulty: "Intermediate",
//         description: "Use GenAI to clean and transform data.",
//         whatYoullLearn: ["Data preprocessing with AI", "Automated transformation"],
//         whatYoullDo: ["Run cleanup tasks", "Evaluate data quality"]
//       },
//       {
//         id: 3,
//         title: "Task Three",
//         fullTitle: "Automating Insights Generation",
//         duration: "60 mins",
//         difficulty: "Intermediate",
//         description: "Generate dashboards and summaries using GenAI.",
//         whatYoullLearn: ["Insight creation", "GenAI visualization"],
//         whatYoullDo: ["Build an AI summary dashboard"]
//       }
//     ]
//   },
//   {
//     id: 3,
//     company: "Tata Group",
//     title: "Web Development: Building Responsive and Dynamic Applications",
//     description: "Learn to build dynamic websites using modern web tech.",
//     category: "Technology",
//     difficulty: "Beginner",
//     duration: "4-5 hours",
//     rating: "6200+ 5 Star Reviews",
//     isFree: true,
//     isNew: false,
//     image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=400&fit=crop",
//     overview: "Hands-on practice in web page structure, styling, and interaction.",
//     features: ["Real coding", "Beginner support", "Practical tasks"],
//     aboutCompany: "Tata Group's tech division enables digital transformation at scale.",
//     skills: ["HTML", "CSS", "JavaScript", "Responsive Design", "Web Hosting"],
//     tasks: [
//       {
//         id: 1,
//         title: "Task One",
//         fullTitle: "Creating a Personal Portfolio Website",
//         duration: "60 mins",
//         difficulty: "Beginner",
//         description: "Build your first personal portfolio using HTML & CSS.",
//         whatYoullLearn: ["HTML structure", "CSS styling"],
//         whatYoullDo: ["Create a home page", "Add contact section"]
//       },
//       {
//         id: 2,
//         title: "Task Two",
//         fullTitle: "Adding Interactivity with JavaScript",
//         duration: "60 mins",
//         difficulty: "Beginner",
//         description: "Make your site interactive with JS basics.",
//         whatYoullLearn: ["Event handling", "Dynamic content"],
//         whatYoullDo: ["Add JS form validation"]
//       }
//     ]
//   },
//   {
//     id: 4,
//     company: "Tata Group",
//     title: "App Development: Designing User-Centric Mobile Experiences",
//     description: "Learn mobile UX and prototyping with real app flows.",
//     category: "Technology",
//     difficulty: "Beginner",
//     duration: "3-5 hours",
//     rating: "5800+ 5 Star Reviews",
//     isFree: true,
//     isNew: true,
//     image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
//     overview: "Understand the mobile user journey and how to prototype quickly.",
//     features: ["UX-focused", "Use tools like Figma", "Real designs"],
//     aboutCompany: "Tata Digital invests in intuitive, user-first mobile applications across sectors.",
//     skills: ["UX Design", "Wireframing", "Prototyping", "Mobile Flows"],
//     tasks: [
//       {
//         id: 1,
//         title: "Task One",
//         fullTitle: "Sketching a Mobile App Flow",
//         duration: "45 mins",
//         difficulty: "Beginner",
//         description: "Sketch a simple app journey (e.g., a food order app).",
//         whatYoullLearn: ["User flows", "Mobile interaction"],
//         whatYoullDo: ["Design wireframes"]
//       },
//       {
//         id: 2,
//         title: "Task Two",
//         fullTitle: "Prototyping in Figma",
//         duration: "60 mins",
//         difficulty: "Beginner",
//         description: "Create a working mobile prototype in Figma.",
//         whatYoullLearn: ["Interactive design", "Clickable prototypes"],
//         whatYoullDo: ["Build a mobile prototype"]
//       }
//     ]
//   },
//   {
//     id: 5,
//     company: "Tata Group",
//     title: "Data Analytics: Transforming Data into Strategic Decisions",
//     description: "Get hands-on with turning raw data into business value.",
//     category: "Data",
//     difficulty: "Intermediate",
//     duration: "3-4 hours",
//     rating: "6950+ 5 Star Reviews",
//     isFree: true,
//     isNew: false,
//     image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&h=400&fit=crop",
//     overview: "A simulation to help future analysts derive decisions from trends and patterns.",
//     features: ["Data storytelling", "Excel and BI tools", "Use cases"],
//     aboutCompany: "Tata Group delivers strategic insights using data across its ecosystem.",
//     skills: ["Excel", "Power BI", "Trend Analysis", "Presentation"],
//     tasks: [
//       {
//         id: 1,
//         title: "Task One",
//         fullTitle: "Cleaning and Preparing Data",
//         duration: "45 mins",
//         difficulty: "Intermediate",
//         description: "Use Excel to clean a messy dataset.",
//         whatYoullLearn: ["Data cleanup", "Excel functions"],
//         whatYoullDo: ["Clean sales data"]
//       },
//       {
//         id: 2,
//         title: "Task Two",
//         fullTitle: "Building a Dashboard in Power BI",
//         duration: "60 mins",
//         difficulty: "Intermediate",
//         description: "Create a sales performance dashboard.",
//         whatYoullLearn: ["BI visualization", "KPIs"],
//         whatYoullDo: ["Build and interpret dashboards"]
//       }
//     ]
//   }
// ];
