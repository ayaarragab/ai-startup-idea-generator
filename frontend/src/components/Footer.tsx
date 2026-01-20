import React from 'react';
import { Github, FileText, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-24">
      <div className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Project Info */}
          <div className="space-y-4">
            <h6 className="text-white">Project Info</h6>
            <div className="space-y-2">
              <p className="text-neutral-400">Helwan University</p>
              <p className="text-neutral-400">Faculty of Computer Science & AI</p>
              <p className="text-neutral-400">Department of AI & NLP</p>
            </div>
          </div>
          
          {/* Supervision */}
          <div className="space-y-4">
            <h6 className="text-white">Supervision</h6>
            <div className="space-y-2">
              <p className="text-neutral-400">Dr. Ahmed Hassan</p>
              <p className="text-neutral-400">Professor of AI & NLP</p>
            </div>
          </div>
          
          {/* Team */}
          <div className="space-y-4">
            <h6 className="text-white">Team Members</h6>
            <div className="space-y-2">
              <p className="text-neutral-400">Sarah Mohamed</p>
              <p className="text-neutral-400">Karim Ali</p>
              <p className="text-neutral-400">Nour Hassan</p>
              <p className="text-neutral-400">Omar Youssef</p>
            </div>
          </div>
          
          {/* Links */}
          <div className="space-y-4">
            <h6 className="text-white">Resources</h6>
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
            © 2025 AI Startup Idea Generator - Academic Research Project
          </p>
        </div>
      </div>
    </footer>
  );
}
