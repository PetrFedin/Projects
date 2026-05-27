'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LabDip, LabDipStatus } from '@/lib/types/material-engineering';
import { CheckCircle2, XCircle, Clock, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Workshop2MaterialLabDipsPanelProps {
  materialId: string;
}

export function Workshop2MaterialLabDipsPanel({ materialId }: Workshop2MaterialLabDipsPanelProps) {
  const [labDips, setLabDips] = useState<LabDip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLabDips = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/brand/workshop2/materials/lab-dips?materialId=${materialId}`
        );
        if (!response.ok) throw new Error('Failed to fetch lab dips');
        const data = await response.json();
        setLabDips(data.labDips);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabDips();
  }, [materialId]);

  const handleStatusUpdate = async (id: string, newStatus: LabDipStatus) => {
    // Optimistic update
    const previousDips = [...labDips];
    setLabDips((current) =>
      current.map((dip) => (dip.id === id ? { ...dip, status: newStatus } : dip))
    );

    try {
      const response = await fetch('/api/brand/workshop2/materials/lab-dips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating lab dip:', err);
      // Revert on failure
      setLabDips(previousDips);
    }
  };

  const getStatusBadge = (status: LabDipStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lab Dips & Strike-offs</CardTitle>
          <CardDescription>Loading material artifacts...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lab Dips & Strike-offs</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lab Dips & Strike-offs</CardTitle>
        <CardDescription>
          Review and approve color and print samples for this material.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {labDips.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No lab dips or strike-offs submitted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {labDips.map((dip) => (
              <Card key={dip.id} className="overflow-hidden">
                <div className="relative flex aspect-video items-center justify-center bg-muted">
                  {dip.imageUrl ? (
                    <Image
                      src={dip.imageUrl}
                      alt={`${dip.type} sample`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  )}
                  <div className="absolute right-2 top-2">{getStatusBadge(dip.status)}</div>
                  <div className="absolute left-2 top-2">
                    <Badge
                      variant="outline"
                      className="bg-background/80 capitalize backdrop-blur-sm"
                    >
                      {dip.type.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 text-sm text-muted-foreground">
                    Submitted: {new Date(dip.submittedAt).toLocaleDateString()}
                  </div>
                  {dip.notes && <p className="mb-4 text-sm">{dip.notes}</p>}

                  {dip.status === 'pending' && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        className="flex-1"
                        variant="default"
                        onClick={() => handleStatusUpdate(dip.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(dip.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
