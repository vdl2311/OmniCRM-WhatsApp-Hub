import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Pipeline, Stage } from '../../types';
import { X, Settings, Plus, Trash2, Check, ArrowDown, ArrowUp } from 'lucide-react';

interface PipelineManagerModalProps {
  onClose: () => void;
}

export const PipelineManagerModal: React.FC<PipelineManagerModalProps> = ({ onClose }) => {
  const { pipelines, addPipeline, updatePipeline, activePipelineId, setActivePipelineId } = useApp();

  const [selectedPipeId, setSelectedPipeId] = useState<string>(activePipelineId);
  const activePipe = pipelines.find(p => p.id === selectedPipeId) || pipelines[0];

  const [stages, setStages] = useState<Stage[]>(activePipe?.stages || []);
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('#3B82F6');

  const [newPipeName, setNewPipeName] = useState('');
  const [isAddingNewPipe, setIsAddingNewPipe] = useState(false);

  const handleSaveStages = () => {
    updatePipeline(selectedPipeId, { stages });
    alert('Etapas salvas com sucesso!');
    onClose();
  };

  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    const newStage: Stage = {
      id: `stg-custom-${Date.now()}`,
      name: newStageName.trim(),
      color: newStageColor,
      order: stages.length + 1,
    };
    setStages(prev => [...prev, newStage]);
    setNewStageName('');
  };

  const handleDeleteStage = (stageId: string) => {
    if (stages.length <= 2) {
      alert('O funil deve conter pelo menos 2 etapas.');
      return;
    }
    setStages(prev => prev.filter(s => s.id !== stageId));
  };

  const handleCreateNewPipeline = () => {
    if (!newPipeName.trim()) return;
    const defaultStages: Stage[] = [
      { id: `s1-${Date.now()}`, name: 'Novo Lead', color: '#6366F1', order: 1 },
      { id: `s2-${Date.now()}`, name: 'Em Atendimento', color: '#3B82F6', order: 2 },
      { id: `s3-${Date.now()}`, name: 'Proposta Enviada', color: '#F59E0B', order: 3 },
      { id: `s4-${Date.now()}`, name: 'Venda Concluída', color: '#10B981', order: 4, isWon: true },
      { id: `s5-${Date.now()}`, name: 'Perdido', color: '#EF4444', order: 5, isLost: true },
    ];
    addPipeline({
      name: newPipeName.trim(),
      stages: defaultStages,
    });
    setNewPipeName('');
    setIsAddingNewPipe(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Gerenciador de Funis e Etapas</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Pipeline Switcher */}
          <div className="flex items-center justify-between gap-2">
            <select
              value={selectedPipeId}
              onChange={e => {
                setSelectedPipeId(e.target.value);
                const p = pipelines.find(pipe => pipe.id === e.target.value);
                if (p) setStages(p.stages);
              }}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
            >
              {pipelines.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <button
              onClick={() => setIsAddingNewPipe(!isAddingNewPipe)}
              className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Funil</span>
            </button>
          </div>

          {isAddingNewPipe && (
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center gap-2">
              <input
                type="text"
                value={newPipeName}
                onChange={e => setNewPipeName(e.target.value)}
                placeholder="Nome do novo pipeline (Ex: Pós-Venda / CS)"
                className="flex-1 bg-white border border-emerald-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              />
              <button
                onClick={handleCreateNewPipeline}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
              >
                Criar
              </button>
            </div>
          )}

          {/* Stages List */}
          <div>
            <label className="font-semibold text-slate-700 block mb-2">
              Etapas Personalizadas do Funil ({stages.length})
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {stages.map((stage, idx) => (
                <div key={stage.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }}></span>
                    <input
                      type="text"
                      value={stage.name}
                      onChange={e => {
                        const val = e.target.value;
                        setStages(prev => prev.map(s => s.id === stage.id ? { ...s, name: val } : s));
                      }}
                      className="bg-transparent font-semibold text-slate-800 focus:bg-white focus:outline-none px-1 rounded"
                    />
                    {stage.isWon && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">GANHO</span>}
                    {stage.isLost && <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">PERDIDO</span>}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={stage.color}
                      onChange={e => {
                        const col = e.target.value;
                        setStages(prev => prev.map(s => s.id === stage.id ? { ...s, color: col } : s));
                      }}
                      className="w-6 h-6 border-0 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => handleDeleteStage(stage.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Stage Form */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={newStageName}
              onChange={e => setNewStageName(e.target.value)}
              placeholder="Adicionar nova etapa..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
            />
            <input
              type="color"
              value={newStageColor}
              onChange={e => setNewStageColor(e.target.value)}
              className="w-8 h-8 rounded border-0 cursor-pointer"
            />
            <button
              onClick={handleAddStage}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveStages}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
