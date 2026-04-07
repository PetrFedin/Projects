'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { TeamMember, TeamMemberStatus } from '@/lib/types';
import { partnerTeams } from '../_fixtures/team-data';

export function useTeamManagement() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'active' | 'archive' | 'structure' | 'finance' | 'audit' | 'analytics' | 'onboarding' | 'matrix'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [onboardingMember, setOnboardingMember] = useState<TeamMember | null>(null);
  
  const team = user?.team || [];
  const limit = user?.teamLimit || 5;
  const isProjectAdmin = user?.roles?.includes('admin') || user?.activeOrganizationId === 'org-hq-001';
  
  // Scoped to active organization
  const [activeOrgId, setActiveOrgId] = useState<string>(user?.activeOrganizationId || 'org-hq-001');

  const allPartnerTeams = useMemo(() => {
    // If Global Admin, they see all organizations/tenants
    if (isProjectAdmin) {
      return partnerTeams;
    }
    // For non-admins, they only see organizations they are part of
    const userOrgs = user?.organizations?.map(o => o.organizationId) || [];
    const filtered: Record<string, TeamMember[]> = {};
    userOrgs.forEach(id => {
      if (partnerTeams[id]) filtered[id] = partnerTeams[id];
    });
    return filtered;
  }, [isProjectAdmin, user]);

  const activeTeam = useMemo(() => {
    return allPartnerTeams[activeOrgId] || [];
  }, [allPartnerTeams, activeOrgId]);

  const currentViewerInTeam = useMemo(() => {
    if (!user) return null;
    return activeTeam.find((m: any) => m.nickname === user.nickname || m.email === user.email);
  }, [activeTeam, user]);

  const viewerStatus = currentViewerInTeam?.status || (isProjectAdmin ? 'admin' : 'member');

  const filteredTeam = useMemo(() => {
    return activeTeam.filter((m: any) => {
      const searchStr = `${m.firstName} ${m.lastName} ${m.nickname} ${m.email} ${m.role} ${m.department || ''}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'active' ? !m.isArchived : m.isArchived;
      return matchesSearch && matchesTab;
    });
  }, [activeTeam, searchQuery, activeTab]);

  const handleAddMember = async (email: string, role: string, department: string, status: TeamMemberStatus) => {
    if (!user) return;
    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      firstName: 'Новый',
      lastName: 'Сотрудник',
      nickname: `pending_${Date.now()}`,
      email, role, department, status,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      joinedAt: new Date().toISOString(),
      isOnline: false,
      invitationStatus: 'pending',
      onboardingStep: 'password',
      history: [],
      stats: { timeSpentBySection: {} }
    };
    try {
      await updateProfile({ team: [...(user.team || []), newMember] as any });
      toast({ title: "Приглашение отправлено" });
      setIsAddDialogOpen(false);
    } catch (err) {
      toast({ title: "Ошибка", variant: 'destructive' });
    }
  };

  const handleUpdateMember = async (data: Partial<TeamMember>) => {
    if (!user?.team || !editingMember) return;
    const updatedTeam = user.team.map(m => m.id === editingMember.id ? { ...m, ...data } : m);
    await updateProfile({ team: updatedTeam as any });
    setIsEditDialogOpen(false);
    setEditingMember(null);
  };

  const handleArchive = async (memberId: string, archive: boolean) => {
    if (!user?.team) return;
    const updatedTeam = user.team.map(m => m.id === memberId ? { ...m, isArchived: archive } : m);
    await updateProfile({ team: updatedTeam as any });
  };

  return {
    user, team, activeTab, setActiveTab, searchQuery, setSearchQuery,
    isAddDialogOpen, setIsAddDialogOpen, isEditDialogOpen, setIsEditDialogOpen,
    selectedMember, setSelectedMember, editingMember, setEditingMember,
    onboardingMember, setOnboardingMember, activeOrgId, setActiveOrgId,
    isProjectAdmin, activeTeam, filteredTeam, currentViewerInTeam, viewerStatus,
    handleAddMember, handleUpdateMember, handleArchive, limit, allPartnerTeams
  };
}
