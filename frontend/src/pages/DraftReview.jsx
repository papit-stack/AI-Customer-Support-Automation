import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchDraft, approveDraft, rejectDraft, editDraft } from "../utils/api";
import { formatDateTime, INTENT_LABELS, STATUS_COLORS } from "../utils/helpers";

export default function DraftReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDraft(id);
        setDraft(data);
        setReplyText(data.ai_reply);
      } catch (err) {
        console.error("Failed to load draft:", err);
        setToast({ type: "error", message: "Failed to load draft" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleApprove() {
    setActionLoading(true);
    try {
      const updated = await approveDraft(id);
      setDraft(updated);
      showToast("success", "Draft approved successfully");
    } catch (err) {
      showToast("error", "Failed to approve draft");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    setActionLoading(true);
    try {
      const updated = await rejectDraft(id);
      setDraft(updated);
      showToast("success", "Draft rejected");
    } catch (err) {
      showToast("error", "Failed to reject draft");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSaveEdit() {
    if (!replyText.trim()) {
      showToast("error", "Reply cannot be empty");
      return;
    }
    setActionLoading(true);
    try {
      const updated = await editDraft(id, replyText);
      setDraft(updated);
      showToast("success", "Draft saved as edited");
    } catch (err) {
      showToast("error", "Failed to save edits");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Draft not found.</p>
        <Link to="/inbox" className="text-primary-600 hover:underline mt-2 inline-block">
          Back to inbox
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-opacity ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            Draft Review #{draft.draft_id}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {draft.thread_id && `Thread: ${draft.thread_id}`}
          </p>
        </div>
        <span
          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
            STATUS_COLORS[draft.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {draft.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Customer Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Customer Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900">{draft.customer_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{draft.customer_email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Intent</p>
                <p className="text-sm font-medium text-gray-900">
                  {INTENT_LABELS[draft.intent] || draft.intent}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm text-gray-700">
                  {formatDateTime(draft.created_at)}
                </p>
              </div>
              {draft.approved_at && (
                <div>
                  <p className="text-xs text-gray-500">Approved</p>
                  <p className="text-sm text-gray-700">
                    {formatDateTime(draft.approved_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Actions
            </h3>
            <button
              onClick={handleApprove}
              disabled={actionLoading || draft.status === "Approved" || draft.status === "Sent"}
              className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
            >
              {actionLoading ? "Processing..." : "Approve"}
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={actionLoading || replyText === draft.ai_reply}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
            >
              Save Edit
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading || draft.status === "Rejected" || draft.status === "Sent"}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
            >
              Reject
            </button>
          </div>
        </div>

        {/* Right Column - Messages */}
        <div className="lg:col-span-2 space-y-4">
          {/* Subject */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
              Subject
            </h3>
            <p className="text-gray-900 font-medium">{draft.subject}</p>
          </div>

          {/* Customer Message */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Customer Message
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {draft.customer_message}
              </p>
            </div>
          </div>

          {/* AI Reply (Editable) */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                AI Generated Reply
              </h3>
              {replyText !== draft.ai_reply && (
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">
                  Modified
                </span>
              )}
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={14}
              className="w-full border border-gray-300 rounded-lg p-4 text-sm text-gray-700 leading-relaxed focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
