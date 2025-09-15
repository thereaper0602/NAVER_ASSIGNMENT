import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Link to='/'>
                                <span className="text-white font-bold text-lg">K</span>
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Kanban Board
                            </h1>
                            <p className="text-slate-400 text-sm">Project Management System</p>
                        </div>
                        <div>
                            <div className="flex space-x-4 mt-1">
                                <div className="flex justify-between justify-content-center rounded-lg bg-slate-800/50 px-3 py-1">
                                    <Link to='/' className="mr-4 text-slate-300 hover:text-white text-sm font-medium transition-colors">
                                        Kanban Board
                                    </Link>
                                </div>
                                <div className="flex justify-between justify-content-center rounded-lg bg-slate-800/50 px-3 py-1">
                                    <Link to='/calendar' className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                                        Calendar
                                    </Link>
                                </div>
                                <div className="flex justify-between justify-content-center rounded-lg bg-slate-800/50 px-3 py-1">
                                    <Link to='/dashboard' className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                                        Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
};

export default Header;