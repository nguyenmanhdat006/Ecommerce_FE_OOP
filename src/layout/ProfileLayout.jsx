export default function ProfileLayout({ sidebar, children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* Sidebar slot */}
            {sidebar}

            {/* Main content slot */}
            <div className="md:col-span-3">
              {children}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
