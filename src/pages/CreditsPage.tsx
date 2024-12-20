import React, { useState } from 'react'
import { Button } from 'flowbite-react'
import { BookOpen, Github, Mail } from 'lucide-react'
import Header from '../components/layout/Header'

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  links: {
    github?: string;
    scholar?: string;
    email?: string;
  };
}

export const CreditsPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Lucy Gray',
      role: 'Principal Investigator',
      image: 'https://gda.dei.unipd.it/static/images/credits/gian_960x960.jpg',
      bio: 'Leading research in knowledge graph verification and large language models.',
      links: {
        github: 'https://github.com/lucygray',
        scholar: 'https://scholar.google.com/lucygray',
        email: 'lucy.gray@university.edu'
      }
    },
    {
      id: 2,
      name: 'Richard Mills',
      role: 'Senior Researcher',
      image: 'https://gda.dei.unipd.it/static/images/credits/gian_960x960.jpg',
      bio: 'Specializing in machine learning and natural language processing.',
      links: {
        github: 'https://github.com/rmills',
        scholar: 'https://scholar.google.com/rmills',
        email: 'r.mills@university.edu'
      }
    },
    {
      id: 3,
      name: 'Sophie Chamberlain',
      role: 'Research Scientist',
      image: 'https://gda.dei.unipd.it/static/images/credits/gian_960x960.jpg',
      bio: 'Expert in transformer architectures and knowledge representation.',
      links: {
        github: 'https://github.com/sophiec',
        scholar: 'https://scholar.google.com/sophiec',
        email: 's.chamberlain@university.edu'
      }
    }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 bg-white">
        <div className="h-full container mx-auto px-4 max-w-7xl flex flex-col p-4">
          {/* Main Content Container */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column: Team Section */}
            <div className="flex flex-col lg:col-span-3">
              <h2 className="text-xl font-semibold mb-4">Our Team</h2>
              <div className="grid grid-cols-3 gap-3 h-[calc(100%-2rem)]">
                {teamMembers.map(member => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>

            {/* Right Column: Project Links and Citation */}
            <div className="flex flex-col gap-4 lg:col-span-1">
              <div className="flex-1">
                <ProjectLinks />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <CiteSection />
          </div>
        </div>
      </div>
    </div>
  );
};

// Update TeamMemberCard to be more compact
const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={member.image}
        alt={member.name}
        className={`w-full h-full object-cover transition-transform duration-500
          ${isHovered ? 'scale-110 grayscale-0' : 'grayscale'}`}
      />

      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent
        transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white">{member.name}</h3>
          <p className="text-sm text-gray-300">{member.role}</p>
          <p className="text-xs text-gray-300 mt-2 line-clamp-2">{member.bio}</p>

          <div className="flex gap-2 mt-3">
            {Object.entries(member.links).map(([key, value]) => (
              value && (
                <a
                  key={key}
                  href={key === 'email' ? `mailto:${value}` : value}
                  target={key !== 'email' ? '_blank' : undefined}
                  rel={key !== 'email' ? 'noopener noreferrer' : undefined}
                  className="text-white hover:text-purple-400"
                >
                  {key === 'email' ? <Mail className="w-4 h-4" /> :
                    key === 'github' ? <Github className="w-4 h-4" /> :
                      <BookOpen className="w-4 h-4" />}
                </a>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Update ProjectLinks to be more compact
const ProjectLinks: React.FC = () => (
  <div className="rounded-lg p-3 h-full">
    <h2 className="text-lg font-semibold mb-3">Project Links</h2>
    <div className="space-y-2">
      <a
        href="https://github.com/yourusername/project"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 bg-white rounded-md border hover:border-gray-400"
      >
        <Github className="w-5 h-5" />
        <div>
          <div className="font-medium text-sm">GitHub Repository</div>
          <div className="text-xs text-gray-500">View code and docs</div>
        </div>
      </a>
      <a
        href="https://arxiv.org/abs/paper.id"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 bg-white rounded-md border hover:border-gray-400"
      >
        <BookOpen className="w-5 h-5" />
        <div>
          <div className="font-medium text-sm">Research Paper</div>
          <div className="text-xs text-gray-500">Read on arXiv</div>
        </div>
      </a>
    </div>
  </div>
);

// Update CiteSection to be more compact
const CiteSection: React.FC = () => {
  const [copied, setCopied] = useState(false)

  const citation = `@inproceedings{knowledge-graph-verification-2024,
  title={Knowledge Graph Verification using Large Language Models},
  author={Gray, Lucy and Mills, Richard and Chamberlain, Sophie},
  booktitle={ACL 2024},
  year={2024}
}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='rounded-xl p-8'>
      <h2 className='text-xl font-semibold mb-4 text-center'>Cite Our Work</h2>
      <div className='font-mono text-sm bg-white p-6 rounded-lg border mb-4 whitespace-pre-wrap'>
        {citation}
      </div>
      <Button
        size='sm'
        onClick={copyToClipboard}
        className='transition-colors duration-300'
      >
        {copied ? 'Copied!' : 'Copy Citation'}
      </Button>
    </div>
  )
}