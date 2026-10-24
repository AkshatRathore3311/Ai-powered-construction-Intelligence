import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { SAMPLE_HISTORY_ITEMS } from '../../data/sampleData';

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Safety Monitoring', 'Crack Detection', 'Real Estate Valuation', 'Project Planning'];

  const filteredItems = SAMPLE_HISTORY_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenDetail = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analysis History & Audit Log"
        subtitle="Searchable record of past site safety audits, crack diagnostic reports, valuations, and project milestones"
        badgeText="Audit Trail"
        badgeVariant="blue"
        actions={
          <button
            onClick={() => alert('Exporting history dataset in CSV format (UI Demo)...')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Export Audit CSV
          </button>
        }
      />

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records by ID, site, or defect description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No Matching History Records"
          description={`No inspection records found matching "${searchTerm}" under "${selectedCategory}".`}
          actionLabel="Clear Search Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Record ID</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Target Asset / Inspection</th>
                  <th className="p-3.5">Site Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="p-3.5 font-mono font-bold text-amber-400">{item.id}</td>
                    <td className="p-3.5 font-mono text-slate-400">{item.date}</td>
                    <td className="p-3.5">
                      <Badge variant={item.badgeColor} size="xs">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </td>
                    <td className="p-3.5 text-slate-400">{item.site}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(item);
                        }}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? `Audit Record: ${selectedRecord.id}` : 'Record Details'}
      >
        {selectedRecord && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedRecord.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedRecord.site}</p>
              </div>
              <Badge variant={selectedRecord.badgeColor}>{selectedRecord.category}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Timestamp</span>
                <p className="font-mono font-medium text-white mt-0.5">{selectedRecord.date}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Verification Status</span>
                <p className="font-mono font-medium text-emerald-400 mt-0.5">{selectedRecord.status}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-semibold">Executive Inspection Summary:</span>
              <p className="text-white mt-1 leading-relaxed">{selectedRecord.summary}</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <div className="font-bold mb-0.5">Database Audit Integrity Note</div>
              <p className="text-[11px] text-amber-200/80">
                In Phase 6, this record will be backed by Supabase PostgreSQL with cryptographic hashing and attached Supabase Storage images.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
