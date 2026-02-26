import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { TeamMember } from '../types';

interface Props {
    member: TeamMember | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function TeamMemberModal({ member, isOpen, onClose }: Props) {
    if (!member) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col md:flex-row"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-teal-600 transition-colors shadow-sm"
                            aria-label="Chiudi"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="w-full md:w-3/5 p-8 overflow-y-auto">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                                    <User className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 leading-tight">{member.name}</h2>
                                    <p className="text-teal-600 font-semibold">{member.role}</p>
                                </div>
                            </div>

                            <div className="prose prose-teal max-w-none">
                                {member.fullDescription.split('\n\n').map((paragraph, index) => (
                                    <p key={index} className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
