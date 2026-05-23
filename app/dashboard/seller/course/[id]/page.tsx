'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '../../../../../context/StoreContext';
import { CourseModule, CourseLesson, Product } from '../../../../../types';
import { ArrowLeft, Plus, Video, Trash2, Edit2, GripVertical, Save } from 'lucide-react';
import { FileUpload } from '../../../../../components/FileUpload';
import toast from 'react-hot-toast';

export default function CourseBuilder() {
    const params = useParams();
    const router = useRouter();
    const { products, updateProduct } = useStore();
    const [product, setProduct] = useState<Product | null>(null);
    const [modules, setModules] = useState<CourseModule[]>([]);
    
    // Edit states
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [lessonForm, setLessonForm] = useState<Partial<CourseLesson>>({});

    useEffect(() => {
        if (params.id) {
            const foundProduct = products.find(p => p.id === params.id);
            if (foundProduct && foundProduct.type === 'COURSE') {
                setProduct(foundProduct);
                setModules(foundProduct.curriculum || []);
            }
        }
    }, [params.id, products]);

    const handleAddModule = () => {
        const newModule: CourseModule = {
            id: `mod_${Date.now()}`,
            title: `New Module ${modules.length + 1}`,
            lessons: []
        };
        setModules([...modules, newModule]);
    };

    const handleAddLesson = (moduleId: string) => {
        const newLesson: CourseLesson = {
            id: `les_${Date.now()}`,
            title: 'New Lesson',
            isLocked: true
        };
        const updatedModules = modules.map(m => {
            if (m.id === moduleId) {
                return { ...m, lessons: [...m.lessons, newLesson] };
            }
            return m;
        });
        setModules(updatedModules);
        openLessonEditor(newLesson, moduleId);
    };

    const openLessonEditor = (lesson: CourseLesson, moduleId: string) => {
        setEditingModuleId(moduleId);
        setEditingLessonId(lesson.id);
        setLessonForm(lesson);
    };

    const saveLesson = () => {
        if (!editingModuleId || !editingLessonId) return;
        
        const updatedModules = modules.map(m => {
            if (m.id === editingModuleId) {
                return {
                    ...m,
                    lessons: m.lessons.map(l => l.id === editingLessonId ? { ...l, ...lessonForm } as CourseLesson : l)
                };
            }
            return m;
        });
        setModules(updatedModules);
        setEditingLessonId(null);
        setEditingModuleId(null);
        setLessonForm({});
    };

    const saveCurriculum = () => {
        if (!product) return;
        const updatedProduct = {
            ...product,
            curriculum: modules,
            lessons: modules.reduce((acc, m) => acc + m.lessons.length, 0)
        };
        updateProduct(updatedProduct);
        toast.success("Curriculum saved successfully!");
    };

    if (!product) {
        return <div className="p-12 text-center text-gray-500">Loading course...</div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.push('/dashboard/seller')}
                            className="p-2 hover:bg-white rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="font-display font-bold text-2xl text-brand-dark">Course Builder</h1>
                            <p className="text-gray-500">{product.title}</p>
                        </div>
                    </div>
                    <button 
                        onClick={saveCurriculum}
                        className="bg-selar-black text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-lg"
                    >
                        <Save className="w-4 h-4" /> Save Curriculum
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Curriculum Sidebar */}
                    <div className="md:col-span-1 space-y-4">
                        {modules.map((mod, mIndex) => (
                            <div key={mod.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center justify-between">
                                    <input 
                                        type="text" 
                                        value={mod.title}
                                        onChange={(e) => {
                                            const updated = [...modules];
                                            updated[mIndex].title = e.target.value;
                                            setModules(updated);
                                        }}
                                        className="font-bold text-sm bg-transparent border-none focus:ring-0 p-0 w-3/4"
                                    />
                                    <button 
                                        onClick={() => {
                                            if (confirm('Delete this module and all its lessons?')) {
                                                setModules(modules.filter(m => m.id !== mod.id));
                                            }
                                        }}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-2 space-y-1">
                                    {mod.lessons.map((lesson) => (
                                        <div 
                                            key={lesson.id}
                                            onClick={() => openLessonEditor(lesson, mod.id)}
                                            className={`p-2 rounded-lg text-sm flex items-center gap-2 cursor-pointer transition-colors ${editingLessonId === lesson.id ? 'bg-brand-purple/10 text-brand-purple font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                                        >
                                            <Video className="w-3 h-3" />
                                            <span className="truncate flex-1">{lesson.title}</span>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => handleAddLesson(mod.id)}
                                        className="w-full mt-2 p-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2 border border-dashed border-gray-300"
                                    >
                                        <Plus className="w-3 h-3" /> Add Lesson
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        <button 
                            onClick={handleAddModule}
                            className="w-full p-4 bg-white border border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Add Module
                        </button>
                    </div>

                    {/* Lesson Editor */}
                    <div className="md:col-span-2">
                        {editingLessonId ? (
                            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm animate-fade-in">
                                <h3 className="font-bold text-xl text-brand-dark mb-6 border-b border-gray-100 pb-4">Edit Lesson</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Lesson Title</label>
                                        <input 
                                            type="text" 
                                            value={lessonForm.title || ''}
                                            onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Video Content</label>
                                        <FileUpload 
                                            bucket="course_videos"
                                            accept="video/*"
                                            label="Upload Video Lesson"
                                            hint="MP4, WebM (Max 500MB)"
                                            onUploadComplete={(url) => setLessonForm({ ...lessonForm, videoUrl: url })}
                                            currentUrl={lessonForm.videoUrl}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Text Content / Notes</label>
                                        <textarea 
                                            value={lessonForm.content || ''}
                                            onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                                            rows={6}
                                            placeholder="Add notes, resources, or transcript here..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <input 
                                            type="checkbox"
                                            checked={!lessonForm.isLocked}
                                            onChange={e => setLessonForm({ ...lessonForm, isLocked: !e.target.checked })}
                                            className="w-5 h-5 rounded text-brand-purple focus:ring-brand-purple"
                                            id="preview-toggle"
                                        />
                                        <label htmlFor="preview-toggle" className="text-sm font-bold text-brand-dark cursor-pointer">
                                            Make this lesson a free preview
                                            <p className="text-xs text-gray-500 font-normal">Anyone can watch this lesson without purchasing</p>
                                        </label>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                                        <button 
                                            onClick={saveLesson}
                                            className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl h-full flex flex-col items-center justify-center text-gray-400 p-12 text-center min-h-[400px]">
                                <Video className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-bold text-lg text-brand-dark mb-1">Select a lesson to edit</p>
                                <p className="text-sm">Click on a lesson in the sidebar to add video and content.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
