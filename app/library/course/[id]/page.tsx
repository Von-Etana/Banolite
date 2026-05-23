'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '../../../../context/StoreContext';
import { Product, CourseModule, CourseLesson } from '../../../../types';
import { ArrowLeft, PlayCircle, CheckCircle2, Lock, FileText, ChevronDown, ChevronRight, Menu, X, Video } from 'lucide-react';

export default function CourseViewer() {
    const params = useParams();
    const router = useRouter();
    const { products, user } = useStore();
    const [course, setCourse] = useState<Product | null>(null);
    const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (params.id && user) {
            const foundCourse = products.find(p => p.id === params.id && p.type === 'COURSE');
            
            // Allow access if they own it or if it's a preview (preview logic checked per lesson later)
            const hasAccess = user.purchasedProductIds.includes(params.id as string) || foundCourse?.creatorId === user.id;
            
            if (foundCourse && hasAccess) {
                setCourse(foundCourse);
                // Set initial active lesson
                if (foundCourse.curriculum && foundCourse.curriculum.length > 0) {
                    const firstModule = foundCourse.curriculum[0];
                    setActiveModule(firstModule.id);
                    if (firstModule.lessons.length > 0) {
                        setActiveLesson(firstModule.lessons[0]);
                    }
                }
            } else {
                // If no access, maybe redirect to product page
                router.push(`/book/${params.id}`);
            }
        } else if (!user) {
            router.push('/');
        }
    }, [params.id, products, user, router]);

    if (!course) {
        return <div className="min-h-screen flex items-center justify-center">Loading course player...</div>;
    }

    const toggleModule = (moduleId: string) => {
        setActiveModule(activeModule === moduleId ? null : moduleId);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
            {/* Header */}
            <div className="bg-selar-black text-white px-4 py-3 flex items-center justify-between z-20 sticky top-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/library')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="font-bold text-lg truncate max-w-[300px] md:max-w-md">{course.title}</h1>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden p-2 hover:bg-white/10 rounded-lg"
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <div className={`flex-1 flex flex-col overflow-y-auto transition-all ${isSidebarOpen ? 'hidden md:flex' : 'flex'}`}>
                    {activeLesson ? (
                        <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8">
                            {/* Video Player Placeholder / Actual Video */}
                            <div className="bg-black aspect-video rounded-2xl overflow-hidden shadow-lg relative flex items-center justify-center">
                                {activeLesson.videoUrl ? (
                                    <video 
                                        src={activeLesson.videoUrl} 
                                        controls 
                                        controlsList="nodownload"
                                        className="w-full h-full object-contain"
                                        poster={course.coverUrl}
                                    />
                                ) : (
                                    <div className="text-center text-white/50">
                                        <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>No video available for this lesson.</p>
                                    </div>
                                )}
                            </div>

                            {/* Lesson Info */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
                                <h2 className="font-display font-bold text-3xl text-brand-dark mb-4">{activeLesson.title}</h2>
                                {activeLesson.content && (
                                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                                        {activeLesson.content}
                                    </div>
                                )}
                            </div>
                            
                            {/* Next Lesson navigation could go here */}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 p-8">
                            <div className="text-center">
                                <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Select a lesson from the curriculum to begin.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Curriculum */}
                <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-80 lg:w-96 bg-white border-l border-gray-200 overflow-y-auto z-10 shadow-xl md:shadow-none`}>
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
                        <h3 className="font-bold text-lg text-brand-dark">Curriculum</h3>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                            <div className="bg-brand-purple h-1.5 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">0% Complete</p>
                    </div>

                    <div className="p-2 space-y-1">
                        {course.curriculum?.map((mod: CourseModule) => (
                            <div key={mod.id} className="mb-2">
                                <button 
                                    onClick={() => toggleModule(mod.id)}
                                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors font-bold text-sm text-brand-dark text-left"
                                >
                                    <span className="truncate pr-4">{mod.title}</span>
                                    {activeModule === mod.id ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                                </button>
                                
                                {activeModule === mod.id && (
                                    <div className="mt-1 pl-2 space-y-1">
                                        {mod.lessons.map(lesson => {
                                            const isActive = activeLesson?.id === lesson.id;
                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => {
                                                        setActiveLesson(lesson);
                                                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                                                    }}
                                                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${isActive ? 'bg-brand-purple/10 border border-brand-purple/20' : 'hover:bg-gray-50 border border-transparent'}`}
                                                >
                                                    <div className="mt-0.5">
                                                        {isActive ? (
                                                            <PlayCircle className="w-4 h-4 text-brand-purple fill-brand-purple/20" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium leading-tight mb-1 ${isActive ? 'text-brand-purple' : 'text-gray-700'}`}>
                                                            {lesson.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                            <span className="flex items-center gap-1"><Video className="w-3 h-3" /> Video</span>
                                                            {lesson.content && <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Text</span>}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        {mod.lessons.length === 0 && (
                                            <p className="text-xs text-gray-400 p-3 italic">No lessons in this module.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
