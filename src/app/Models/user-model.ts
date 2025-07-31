export type userRole = 'TeamLead' | 'TeamMember';

export interface User {
 id: number;
 name: string;
 role: userRole;
}



