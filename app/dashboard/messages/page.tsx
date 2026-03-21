const MESSAGES = [
  {
    from: "Karim B.",
    subject: "Question about homework",
    preview: "Bonjour, mon fils n'a pas pu terminer l'exercice de cette semaine...",
    time: "2h ago",
    read: false,
  },
  {
    from: "Nadia S.",
    subject: "Absence notification",
    preview: "Sara sera absente lundi prochain pour raison médicale.",
    time: "Yesterday",
    read: false,
  },
  {
    from: "Omar T.",
    subject: "Payment confirmation",
    preview: "Bonjour, j'ai effectué le virement pour le mois d'avril.",
    time: "2 days ago",
    read: true,
  },
  {
    from: "Fatima R.",
    subject: "Progress update request",
    preview: "Pourriez-vous me donner un retour sur les progrès de Lina ?",
    time: "3 days ago",
    read: true,
  },
];

export default function MessagesPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-1">Parent and student communications.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + New Message
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <ul role="list">
          {MESSAGES.map((msg) => (
            <li
              key={msg.subject}
              className={`flex items-start gap-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                !msg.read ? "bg-primary-50/40" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold shrink-0">
                {msg.from.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className={`text-sm ${!msg.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                    {msg.from}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">{msg.time}</span>
                </div>
                <p className={`text-sm ${!msg.read ? "font-medium text-gray-800" : "text-gray-600"}`}>{msg.subject}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{msg.preview}</p>
              </div>
              {!msg.read && (
                <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-2" aria-label="Unread" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
