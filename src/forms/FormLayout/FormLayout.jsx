import { FormHeader } from "./FormHeader";

export function FormLayout({ title, onDiscard, onSaveDraft, onPublish, children }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <FormHeader
        title={title}
        onDiscard={onDiscard}
        onSaveDraft={onSaveDraft}
        onPublish={onPublish}
      />

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
