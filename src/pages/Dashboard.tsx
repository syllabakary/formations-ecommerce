import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Video, 
  AlertTriangle, 
  BookOpen, 
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Module {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'exercise';
  duration: string;
  completed: boolean;
  resources?: string[];
  content?: string; // URL ou contenu spécifique
}

interface Course {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  progress: number;
  modules: Module[];
  thumbnail: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Mock data avec plusieurs modules
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Expert en E-commerce Digital',
        startDate: '2024-03-01',
        endDate: '2024-05-01',
        progress: 45,
        thumbnail: 'https://placehold.co/400x200?text=E-commerce',
        modules: [
          {
            id: '1-1',
            title: 'Fondamentaux du E-commerce',
            type: 'video',
            duration: '20 min',
            completed: true,
            resources: ['guide-debase.pdf'],
            content: 'https://vimeo.com/example-video-1'
          },
          {
            id: '1-2',
            title: 'Étude de Marché Avancée',
            type: 'exercise',
            duration: '45 min',
            completed: false,
            resources: ['template-etude-marche.xlsx']
          },
          {
            id: '1-3',
            title: 'Stratégies de Marketing Digital',
            type: 'video',
            duration: '30 min',
            completed: false
          },
          {
            id: '1-4',
            title: 'Certification Finale',
            type: 'quiz',
            duration: '60 min',
            completed: false,
            content: 'quiz-questions-set-1'
          }
        ]
      }
    ];

    setCourses(mockCourses);
  }, []);

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    setExpandedModule(null); // Ferme les modules quand le cours se ferme
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const toggleModuleCompletion = (courseId: string, moduleId: string) => {
    setCourses(prevCourses =>
      prevCourses.map(course => {
        if (course.id !== courseId) return course;
        
        const updatedModules = course.modules.map(module => 
          module.id === moduleId ? { 
            ...module, 
            completed: !module.completed 
          } : module
        );

        const completedCount = updatedModules.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedModules.length) * 100);

        return {
          ...course,
          modules: updatedModules,
          progress
        };
      })
    );
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Parcours de Formation
        </h1>
        <p className="text-xl text-gray-600">
          {user.name}, vous suivez actuellement {courses.length} formation(s)
        </p>
      </div>

      <div className="space-y-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* En-tête du cours */}
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleCourse(course.id)}
            >
              <div className="flex items-center gap-4">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-primary" />
                      <span>
                        {new Date(course.startDate).toLocaleDateString()} - {' '}
                        {new Date(course.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-primary" />
                      <span>{course.progress}% complété</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="text-gray-600">
                {expandedCourse === course.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>

            {/* Contenu détaillé du cours */}
            <AnimatePresence>
              {expandedCourse === course.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Modules de formation</h3>
                      <span className="text-sm text-gray-500">
                        {course.modules.length} modules • {course.modules.filter(m => m.completed).length} complétés
                      </span>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="relative h-3 bg-gray-200 rounded-full mb-6">
                      <div
                        style={{ width: `${course.progress}%` }}
                        className="absolute h-full bg-primary rounded-full transition-all duration-500"
                      />
                    </div>

                    {/* Liste des modules */}
                    <div className="space-y-4">
                      {course.modules.map(module => (
                        <div key={module.id} className="border rounded-lg overflow-hidden">
                          <div 
                            className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                            onClick={() => toggleModule(module.id)}
                          >
                            <div className="flex items-center gap-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleModuleCompletion(course.id, module.id);
                                }}
                                className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors ${
                                  module.completed 
                                    ? 'bg-primary text-white' 
                                    : 'bg-white border-2 border-gray-300'
                                }`}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <div>
                                <h4 className="font-medium">{module.title}</h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    {module.type === 'video' && <Video className="h-4 w-4" />}
                                    {module.type === 'quiz' && <AlertTriangle className="h-4 w-4" />}
                                    {module.type === 'exercise' && <BookOpen className="h-4 w-4" />}
                                    {module.type}
                                  </span>
                                  • 
                                  <span>{module.duration}</span>
                                </div>
                              </div>
                            </div>
                            <button className="text-gray-600">
                              {expandedModule === module.id ? <ChevronUp /> : <ChevronDown />}
                            </button>
                          </div>

                          {/* Contenu détaillé du module */}
                          <AnimatePresence>
                            {expandedModule === module.id && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-4 bg-white border-t"
                              >
                                <div className="flex flex-col gap-4">
                                  {/* Contenu spécifique au type de module */}
                                  {module.content && (
                                    <div className="aspect-video bg-gray-100 rounded-lg">
                                      {module.type === 'video' ? (
                                        <video 
                                          controls 
                                          className="w-full h-full rounded-lg"
                                          src={module.content}
                                        />
                                      ) : (
                                        <div className="p-4">
                                          <h5 className="font-medium mb-2">Quiz interactif</h5>
                                          <p className="text-gray-600">
                                            Répondez aux {module.type === 'quiz' ? 'questions' : 'exercices'}...
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Ressources téléchargeables */}
                                  {module.resources && (
                                    <div className="space-y-2">
                                      <h6 className="text-sm font-medium">Ressources associées :</h6>
                                      <div className="flex flex-wrap gap-2">
                                        {module.resources.map((resource, index) => (
                                          <a
                                            key={index}
                                            href={`/downloads/${resource}`}
                                            download
                                            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                                          >
                                            <Download className="h-4 w-4" />
                                            {resource}
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Actions */}
                                  <div className="flex gap-2 mt-4">
                                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
                                      {module.completed ? 'Revoir le module' : 'Commencer'}
                                    </button>
                                    <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10">
                                      Ajouter aux favoris
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions globales du cours */}
                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => console.log('Reset course date')}
                      className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/10"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Réinitialiser la formation
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
                      Continuer la formation
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;