import React from 'react';
import { Github, FileText, Mail, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-24">
      <div className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Project Information */}
          <div className="space-y-4">
            <h6 className="text-white font-semibold">Project Information</h6>
            <div className="space-y-2 text-neutral-400">
              <p>Graduation Project (2025-2026)</p>
              <p>Helwan University</p>
              <p>Faculty of Computer Science & Artificial Intelligence</p>
              <p>Computer Science Department</p>
            </div>
          </div>

          {/* Supervisor */}
          <div className="space-y-4">
            <h6 className="text-white font-semibold">Project Supervisor</h6>
            <div className="space-y-2 text-neutral-400">
              <p>Dr. Mohammed El-Said</p>
              <p>Professor of Artificial Intelligence & NLP</p>
            </div>
          </div>

          {/* Project Vision */}
          <div className="space-y-4">
            <h6 className="text-white font-semibold">Project Vision</h6>
            <div className="space-y-2 text-neutral-400">
              <p>
                AI-powered startup idea generation tailored to Egyptian market needs,
                cultural context, and societal challenges.
              </p>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h6 className="text-white font-semibold">Resources</h6>
            <div className="flex flex-col gap-3">
              <a href="#" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
                GitHub Repository
              </a>
              <a href="#" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
                Documentation
              </a>
              <a href="#" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                Contact Us
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8">
          <p className="text-center text-neutral-500">
            © 2026 Egyptian AI Startup Idea Generator — Graduation Project
          </p>
        </div>
      </div>
    </footer>
  );
}
