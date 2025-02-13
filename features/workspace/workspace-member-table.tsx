'use client';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { api } from '@/trpc/react';
import { User } from 'better-auth';
import { useParams } from 'next/navigation';

export function WorkspaceMemberTable({ user }: { user: User }) {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { data: members } = api.workspace.members.useQuery({ organizationId });
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[150px]">Role</TableHead>
            <TableHead className="w-[150px]">Since</TableHead>
            <TableHead className="w-[150px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members?.map((member) => (
            <TableRow key={member.memberId}>
              <TableCell>
                <span className="font-medium">{member.name}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{member.role}</Badge>
              </TableCell>
              <TableCell>{member.createdAt.toDateString()}</TableCell>
              <TableCell>
                <div>
                  {members.find((member) => member.role === 'owner')?.userId === user.id &&
                    member.userId !== user.id && (
                      <Button variant="destructive" size="sm">
                        Uninvite
                      </Button>
                    )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
