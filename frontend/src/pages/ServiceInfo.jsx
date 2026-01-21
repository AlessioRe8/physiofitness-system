import { useParams, Link } from "react-router-dom";

const serviceContent = {
    physio: { title: "Physiotherapy", desc: "Expert manual therapy to restore movement.", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" },
    sport: { title: "Sports Massage", desc: "Deep tissue release for athletes.", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1000" },
    rehab: { title: "Rehabilitation", desc: "Post-surgery recovery programs.", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1000" }
};

const ServiceInfo = () => {
    const { type } = useParams();
    const data = serviceContent[type] || serviceContent.physio;

    return (
        <div className="min-h-screen bg-white">
            <div className="h-64 w-full bg-gray-200 relative overflow-hidden">
                <img src={data.img} alt={data.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-white">{data.title}</h1>
                </div>
            </div>
            <div className="max-w-3xl mx-auto p-8 text-center">
                <p className="text-xl text-gray-600 mb-8">{data.desc}</p>
                <div className="space-y-4">
                    <p>If you would like to book a consultation to request this service, click the button below and reach for us!</p>
                    <Link to="/register" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        Book This Service
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default ServiceInfo;