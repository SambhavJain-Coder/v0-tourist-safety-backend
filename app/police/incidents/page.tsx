export default function IncidentManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Incident Management</h1>
          <p className="text-blue-200">Comprehensive incident tracking and response coordination</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search incidents..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-blue-300"
              />
            </div>
            <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white">
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-red-500/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">HIGH PRIORITY</span>
                <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded">ACTIVE</span>
              </div>
              <span className="text-red-300 text-sm">ID: INC-2024-001</span>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">Medical Emergency - Tourist Collapse</h3>
            <p className="text-blue-200 mb-4">
              Tourist reported unconscious at Red Fort main entrance. Ambulance dispatched.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-blue-300 text-sm">Location</p>
                <p className="text-white">Red Fort, Delhi</p>
              </div>
              <div>
                <p className="text-blue-300 text-sm">Reported</p>
                <p className="text-white">2 minutes ago</p>
              </div>
              <div>
                <p className="text-blue-300 text-sm">Response Team</p>
                <p className="text-white">Unit-7, Ambulance-12</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">Update Status</button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">View Details</button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg">Contact Tourist</button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full">MEDIUM PRIORITY</span>
                <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded">INVESTIGATING</span>
              </div>
              <span className="text-yellow-300 text-sm">ID: INC-2024-002</span>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">Lost Tourist - GPS Signal Lost</h3>
            <p className="text-blue-200 mb-4">
              Tourist's GPS signal lost for 15 minutes. Last known location: Connaught Place.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-blue-300 text-sm">Last Location</p>
                <p className="text-white">Connaught Place</p>
              </div>
              <div>
                <p className="text-blue-300 text-sm">Signal Lost</p>
                <p className="text-white">15 minutes ago</p>
              </div>
              <div>
                <p className="text-blue-300 text-sm">Assigned Officer</p>
                <p className="text-white">Officer Sharma</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg">
                Track Location
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Send Alert</button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg">
                Contact Emergency
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
