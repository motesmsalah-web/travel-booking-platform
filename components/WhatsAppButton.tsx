import { MessageCircle } from 'lucide-react';
export default function WhatsAppButton({number}:{number:string}){return <a aria-label="واتساب" className="fixed bottom-5 left-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-green-500 text-white shadow-2xl" target="_blank" href={`https://wa.me/${number}`}><MessageCircle/></a>}
