import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchDrafts } from "../utils/api";
import { formatDate, INTENT_LABELS, STATUS_COLORS } from "../utils/helpers";

const STATUSES = ["Pending", "Approved", "Rejected", "Edited", "Sent"];
const INTENTS = [
  "order_status",
  "refund_request",
  "product_inquiry",
  "product_recommendation",
  "complaint",
  "faq",
];

export default function DraftInbox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const currentStatus = searchParams.get("status") || "";
  const currentIntent = searchParams.get("intent") || "";

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDrafts({
        status: currentStatus || undefined,
        intent: currentIntent || undefined,
        search: searchParams.get("search") || undefined,
      });
      setDrafts(data);
    } catch (err) {
      console.error("Failed to load drafts:", err);
    } finally {
      setLoading(false);
    }
  }, [currentStatus, currentIntent, searchParams]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  }

  function handleSearch(e) {
    e.preventDefault();
    updateParam("search", search.trim());
  }

  function clearFilters() {
    setSearch("");
    setSearchParams({});
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Draft Inbox</h2>
        <p className="text-gray-500 mt-1">Review and manage AI-generated email drafts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[250px]">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or subject..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </form>

          {/* Status Filter */}
          <select
            value={currentStatus}
            onChange={(e) => updateParam("status", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Intent Filter */}
          <select
            value={currentIntent}
            onChange={(e) => updateParam("intent", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="">All Intents</option>
            {INTENTS.map((i) => (
              <option key={i} value={i}>
                {INTENT_LABELS[i]}
              </option>
            ))}
          </select>

          {/* Clear */}
          {(currentStatus || currentIntent || searchParams.get("search")) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : drafts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No drafts found matching your filters.
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Intent</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {drafts.map((draft) => (
                  <tr key={draft.draft_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      #{draft.draft_id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {draft.customer_name}
                      </p>
                      <p className="text-xs text-gray-500">{draft.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-[250px] truncate">
                      {draft.subject}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {INTENT_LABELS[draft.intent] || draft.intent}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[draft.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {draft.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(draft.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/draft/${draft.draft_id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        View
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
              Showing {drafts.length} draft{drafts.length !== 1 && "s"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
