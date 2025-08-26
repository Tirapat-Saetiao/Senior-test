// Mock API service for testing purposes
export const mockAPI = {
    // Mock posts data
    getMockPosts() {
      return {
        data: [
          {
            id: 1,
            attributes: {
              title: "Introduction to Artificial Intelligence",
              description: "Learn the fundamentals of AI, including machine learning, neural networks, and deep learning concepts. This comprehensive guide covers everything from basic algorithms to advanced applications.",
              content: "Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that work and react like humans...",
              image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
              category: "Education",
              createdAt: "2024-01-15T10:30:00.000Z",
              publishedAt: "2024-01-15T10:30:00.000Z"
            }
          },
          {
            id: 2,
            attributes: {
              title: "Machine Learning Fundamentals",
              description: "Explore the core concepts of machine learning including supervised learning, unsupervised learning, and reinforcement learning techniques.",
              content: "Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed...",
              image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop",
              category: "Technology",
              createdAt: "2024-01-14T14:20:00.000Z",
              publishedAt: "2024-01-14T14:20:00.000Z"
            }
          },
          {
            id: 3,
            attributes: {
              title: "AI Ethics and Responsibility",
              description: "Understanding the ethical implications of AI development and deployment, including bias, privacy, and societal impact considerations.",
              content: "As AI systems become more sophisticated, it's crucial to consider the ethical implications of their development and deployment...",
              image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
              category: "Ethics",
              createdAt: "2024-01-13T09:15:00.000Z",
              publishedAt: "2024-01-13T09:15:00.000Z"
            }
          },
          {
            id: 4,
            attributes: {
              title: "Natural Language Processing Basics",
              description: "Learn about NLP techniques for text analysis, sentiment analysis, and language understanding in AI applications.",
              content: "Natural Language Processing (NLP) is a field of AI that focuses on the interaction between computers and human language...",
              image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
              category: "Technology",
              createdAt: "2024-01-12T16:45:00.000Z",
              publishedAt: "2024-01-12T16:45:00.000Z"
            }
          },
          {
            id: 5,
            attributes: {
              title: "Computer Vision Applications",
              description: "Explore how AI is used in computer vision for image recognition, object detection, and visual data analysis.",
              content: "Computer Vision is a field of AI that trains computers to interpret and understand visual information from the world...",
              image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
              category: "Technology",
              createdAt: "2024-01-11T11:30:00.000Z",
              publishedAt: "2024-01-11T11:30:00.000Z"
            }
          }
        ]
      };
    },
  
    // Mock codings data
    getMockCodings() {
      return {
        data: [
          {
            id: 1,
            attributes: {
              title: "Python for AI Development",
              description: "Master Python programming for AI and machine learning projects. Learn essential libraries like TensorFlow, PyTorch, and scikit-learn.",
              content: "Python is the most popular programming language for AI and machine learning development...",
              image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
              category: "Programming",
              createdAt: "2024-01-15T08:00:00.000Z",
              publishedAt: "2024-01-15T08:00:00.000Z"
            }
          },
          {
            id: 2,
            attributes: {
              title: "JavaScript AI Libraries",
              description: "Explore JavaScript libraries for AI development including TensorFlow.js, Brain.js, and other web-based AI tools.",
              content: "JavaScript has become a powerful platform for AI development with the introduction of TensorFlow.js...",
              image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
              category: "Web Development",
              createdAt: "2024-01-14T13:15:00.000Z",
              publishedAt: "2024-01-14T13:15:00.000Z"
            }
          },
          {
            id: 3,
            attributes: {
              title: "R for Statistical Learning",
              description: "Learn R programming for statistical analysis and machine learning. Perfect for data scientists and researchers.",
              content: "R is a powerful language and environment for statistical computing and graphics...",
              image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
              category: "Data Science",
              createdAt: "2024-01-13T10:45:00.000Z",
              publishedAt: "2024-01-13T10:45:00.000Z"
            }
          },
          {
            id: 4,
            attributes: {
              title: "SQL for AI Data Management",
              description: "Master SQL for managing and querying large datasets used in AI and machine learning projects.",
              content: "Structured Query Language (SQL) is essential for managing the large datasets required for AI training...",
              image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop",
              category: "Database",
              createdAt: "2024-01-12T15:20:00.000Z",
              publishedAt: "2024-01-12T15:20:00.000Z"
            }
          },
          {
            id: 5,
            attributes: {
              title: "Git for AI Project Management",
              description: "Learn version control with Git for managing AI projects, collaborating with teams, and tracking code changes.",
              content: "Version control is crucial for AI project management, especially when working with large datasets and complex models...",
              image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
              category: "Development Tools",
              createdAt: "2024-01-11T12:10:00.000Z",
              publishedAt: "2024-01-11T12:10:00.000Z"
            }
          }
        ]
      };
    },
  
    // Mock API responses with delays to simulate real API calls
    async fetchMockPosts() {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate random success/failure for testing
      if (Math.random() > 0.1) { // 90% success rate
        return this.getMockPosts();
      } else {
        throw new Error("Mock API error: Failed to fetch posts");
      }
    },
  
    async fetchMockCodings() {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Simulate random success/failure for testing
      if (Math.random() > 0.1) { // 90% success rate
        return this.getMockCodings();
      } else {
        throw new Error("Mock API error: Failed to fetch codings");
      }
    }
  };