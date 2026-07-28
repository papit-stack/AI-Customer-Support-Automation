import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchStats, fetchDrafts } from "../utils/api";
import { formatDate } from "../utils/helpers";

const STAT_CARDS = [
  { key: "total_drafts", label: "Total Drafts", color: "bg-white", iconColor: "text-gray-600" },
  { key: "pending_reviews", label: "Pending Review", color: "bg-yellow-50", iconColor: "text-yellow-600" },
  { key: "edited_emails", label: "Edited", color: "bg-purple-50", iconColor: "text-purple-600" },
  { key: "sent_emails", label: "Sent", color: "bg-blue-50", iconColor: "text-blue-600" },
  { key: "rejected_emails", label: "Rejected", color: "bg-red-50", iconColor: "text-red-600" },
];

const statIcons = {
  total_drafts: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  pending_reviews: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  edited_emails: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  sent_emails: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  rejected_emails: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentDrafts, setRecentDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, draftsData] = await Promise.all([
          fetchStats(),
          fetchDrafts({ status: "Pending" }),
        ]);
        setStats(statsData);
        setRecentDrafts(draftsData.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Overview of AI-generated email drafts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className={`${card.color} rounded-xl border border-gray-200 p-5`}
          >
            <div className="flex items-center justify-between">
              <span className={`${card.iconColor}`}>{statIcons[card.key]}</span>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold text-gray-900">
                {stats?.[card.key] ?? 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Pending Drafts */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Pending Reviews</h3>
          <Link
            to="/inbox?status=Pending"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all
          </Link>
        </div>
        {recentDrafts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No pending drafts</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Intent</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentDrafts.map((draft) => (
                <tr key={draft.draft_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {draft.customer_name}
                    </p>
                    <p className="text-xs text-gray-500">{draft.customer_email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {draft.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{draft.intent}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(draft.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/draft/${draft.draft_id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
