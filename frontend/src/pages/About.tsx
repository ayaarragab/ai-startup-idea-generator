import React from 'react';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { 
  GraduationCap, 
  Users, 
  Award,
  BookOpen,
  Github,
  Mail,
  Linkedin,
  Target,
  Lightbulb,
  Heart
} from 'lucide-react';

export function About() {
  const projectInfo = {
    university: 'Helwan University',
    faculty: 'Faculty of Computer Science & Artificial Intelligence',
    department: 'Computer Science',
    year: '2025-2026',
    type: 'Graduation Project',
  };

  const supervisor = {
    name: 'Dr. Mohammed El-Said',
    title: 'Professor of Artificial Intelligence & NLP',
    department: 'Computer Science',
    expertise: ['Natural Language Processing', 'Machine Learning', 'Generative AI', 'Arabic Language Technologies'],
  };

  const teamMembers = [
    {
      name: 'Aya Ragab',
      role: 'Full Stack Developer',
      specialization: 'Full Stack Development & Data Collection',
      linkedin: 'https://www.linkedin.com/in/ayaragab/',
      email: 'AyaRagabSaleh@outlook.com',
    },
    {
      name: 'Sarah Mohamed',
      role: 'AI/ML Engineer',
      specialization: 'Generative AI & Evaluation Metrics',
      linkedin: '#',
      email: 'sarah.mohamed@example.com',
    },
    {
      name: 'Omnia Gamal',
      role: 'AI/NLP Engineer',
      specialization: 'Natural Language Processing & Model Integration',
      linkedin: '#',
      email: 'omnia.gamal@example.com',
    },
    {
      name: 'Sagda Fathy',
      role: 'GenAI Engineer',
      specialization: 'Generative AI & Prompt Engineering',
      linkedin: '#',
      email: 'sagda.fathy@example.com',
    },
    {
      name: 'Alshimaa Ahmed',
      role: 'GenAI Engineer',
      specialization: 'Generative AI & Prompt Engineering',
      linkedin: '#',
      email: 'alshimaa.ahmed@example.com',
    },
    {
      name: 'Ahmed Amin',
      role: 'GenAI Engineer',
      specialization: 'Generative AI & Prompt Engineering',
      linkedin: '#',
      email: 'ahmed.amin@example.com',
    },
  ];

  const objectives = [
    {
      icon: Target,
      title: 'Bridge the Gap',
      description: 'Connect Egyptian societal needs with innovative AI-driven startup ideas',
    },
    {
      icon: Lightbulb,
      title: 'Enable Entrepreneurship',
      description: 'Empower aspiring Egyptian entrepreneurs with validated, feasible business ideas',
    },
    {
      icon: Heart,
      title: 'Social Impact',
      description: 'Focus on high-impact solutions that address real challenges in Egyptian society',
    },
    {
      icon: BookOpen,
      title: 'Academic Excellence',
      description: 'Contribute to NLP and AI research with a focus on Arabic language and local context',
    },
  ];

  const technologies = [
    { category: 'AI & NLP', items: ['GPT-4', 'Arabic NLP', 'Sentiment Analysis', 'Topic Modeling'] },
    { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Responsive Design'] },
    { category: 'Backend', items: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'] },
    { category: 'Evaluation', items: ['GraphEval', 'Custom Metrics', 'A/B Testing', 'User Feedback'] },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-neutral-900 mb-4">About This Project</h1>
            <p className="subtitle text-neutral-600 max-w-3xl mx-auto">
              An academic research project combining NLP, Generative AI, and Egyptian market insights to revolutionize startup ideation
            </p>
          </div>

          {/* Project Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card variant="elevated" padding="lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-neutral-900 mb-2">Project Information</h4>
                  <p className="text-neutral-600">Academic research initiative</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span className="text-neutral-600">University</span>
                  <span className="text-neutral-900">{projectInfo.university}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span className="text-neutral-600">Faculty</span>
                  <span className="text-neutral-900 text-right max-w-[60%]">{projectInfo.faculty}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span className="text-neutral-600">Department</span>
                  <span className="text-neutral-900 text-right max-w-[60%]">{projectInfo.department}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-200">
                  <span className="text-neutral-600">Academic Year</span>
                  <span className="text-neutral-900">{projectInfo.year}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-600">Project Type</span>
                  <Tag variant="primary">{projectInfo.type}</Tag>
                </div>
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-neutral-900 mb-2">Project Supervisor</h4>
                  <p className="text-neutral-600">Academic guidance and mentorship</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h5 className="text-neutral-900 mb-1">{supervisor.name}</h5>
                  <p className="text-neutral-600 mb-2">{supervisor.title}</p>
                  <p className="text-neutral-500">{supervisor.department}</p>
                </div>
                <div>
                  <h6 className="text-neutral-900 mb-2">Areas of Expertise</h6>
                  <div className="flex flex-wrap gap-2">
                    {supervisor.expertise.map((area) => (
                      <Tag key={area} variant="secondary" size="sm">
                        {area}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Project Goal */}
          <Card variant="elevated" padding="lg" className="mb-12">
            <h3 className="text-neutral-900 mb-6">Project Goal</h3>
            <p className="text-neutral-700 mb-6">
              This project aims to bridge the gap between Egyptian societal needs and AI-driven innovation by creating 
              a sophisticated system that generates contextually relevant, feasible startup ideas. Unlike generic idea 
              generators, our platform specifically analyzes Egyptian data sources, understands local challenges, and 
              creates solutions tailored to Egypt's unique market dynamics, cultural context, and development priorities.
            </p>
            <p className="text-neutral-700">
              By combining Natural Language Processing, Generative AI, and comprehensive Egyptian market data, we empower 
              aspiring entrepreneurs, students, and researchers to discover innovative business opportunities that can 
              create meaningful social impact while being commercially viable in the Egyptian context.
            </p>
          </Card>

          {/* Objectives */}
          <div className="mb-12">
            <h3 className="text-neutral-900 mb-6 text-center">Our Objectives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {objectives.map((objective) => (
                <Card key={objective.title} variant="bordered" padding="lg" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <objective.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-neutral-900 mb-2">{objective.title}</h5>
                      <p className="text-neutral-600">{objective.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="text-neutral-900">Development Team</h3>
                <p className="text-neutral-600">The minds behind the project</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.name} variant="elevated" padding="lg" className="hover:shadow-xl transition-shadow">
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-neutral-900 mb-1">{member.name}</h5>
                      <p className="text-neutral-600 mb-2">{member.role}</p>
                      <Tag variant="accent" size="sm">{member.specialization}</Tag>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-neutral-200">
                      <a
                        href={member.linkedin}
                        className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">Email</span>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Technologies Used */}
          <Card variant="elevated" padding="lg" className="mb-12">
            <h4 className="text-neutral-900 mb-6">Technologies & Tools</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {technologies.map((tech) => (
                <div key={tech.category}>
                  <h6 className="text-neutral-900 mb-3">{tech.category}</h6>
                  <div className="flex flex-wrap gap-2">
                    {tech.items.map((item) => (
                      <Tag key={item} variant="primary" size="sm">
                        {item}
                      </Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Contact & Resources */}
          <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-primary-50 to-accent-50">
            <div className="text-center">
              <h4 className="text-neutral-900 mb-4">Get Involved</h4>
              <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                We welcome feedback, collaboration opportunities, and contributions from the academic and entrepreneurial communities
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200"
                >
                  <Mail className="w-5 h-5" />
                  Contact Us
                </a>
              </div>
            </div>
          </Card>

          {/* Acknowledgments */}
          <Card variant="bordered" padding="md" className="mt-8">
            <div className="text-center">
              <p className="text-neutral-600">
                Special thanks to Helwan University, our supervisor Dr. Ahmed Hassan, and all the data sources and 
                communities that made this research possible. This project is dedicated to advancing AI research 
                and empowering Egyptian entrepreneurship.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
