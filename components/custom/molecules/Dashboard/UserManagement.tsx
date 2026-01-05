'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    GetAllUsers,
    UpdateUser,
    DeleteUser,
} from '@/server/serverFn'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Users, Edit, Trash2, Mail, Shield, MapPin } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useDashboardLocation } from '@/client/store/Dashboard/store'

type UserWithProfile = {
    id: string
    name: string
    email: string
    image: string | null
    profile: {
        role: 'admin' | 'manager' | 'member'
        location: 'america' | 'india' | 'both'
    }
}

export function UserManagement() {
    const location = useDashboardLocation((s) => s.location)
    const [users, setUsers] = useState<UserWithProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [editingUser, setEditingUser] = useState<UserWithProfile | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const data = await GetAllUsers(location)
            setUsers(data as UserWithProfile[])
        } catch (error) {
            toast.error('Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [location])

    const handleUpdate = async () => {
        if (!editingUser) return
        setIsUpdating(true)
        try {
            await UpdateUser(editingUser.id, {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.profile.role,
                location: editingUser.profile.location,
            })
            toast.success('User updated successfully')
            setEditingUser(null)
            fetchUsers()
        } catch (error) {
            toast.error('Failed to update user')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return
        setIsDeleting(userId)
        try {
            await DeleteUser(userId)
            toast.success('User deleted successfully')
            fetchUsers()
        } catch (error) {
            toast.error('Failed to delete user')
        } finally {
            setIsDeleting(null)
        }
    }

    return (
        <div className="p-5 w-full">
            <Card className="rounded-none border border-myborder bg-transparent backdrop-blur-md w-full p-0 gap-0">
                <CardTitle className="w-full flex items-center justify-between py-2 px-3 border-b border-myborder text-md">
                    <div className="flex items-center gap-2">
                        <Users className="size-5 text-primary" />
                        User Management
                    </div>
                </CardTitle>

                <CardContent className="flex flex-col gap-4 py-4 px-4 bg-accent/80 min-h-48">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-2">
                            <Spinner className="size-8 text-primary" />
                            <p className="text-xs text-muted-foreground animate-pulse">Loading users...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                            <Users className="size-10 mb-2 opacity-20" />
                            <p>No other users found</p>
                        </div>
                    ) : (
                        <div className="grid w-[60%] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {users.map((user) => (
                                <Card key={user.id} className="rounded-md border border-myborder bg-background/50 p-4 transition-all hover:bg-accent/40">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-myborder">
                                                <AvatarImage src={user.image || ''} alt={user.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold truncate">{user.name}</h3>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Mail className="size-3" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 py-2 border-t border-myborder/50">
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium capitalize">
                                                <Shield className="size-3" />
                                                {user.profile.role}
                                            </div>
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-muted-foreground text-[10px] font-medium capitalize">
                                                <MapPin className="size-3" />
                                                {user.profile.location}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-myborder">
                                            <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingUser(user)}>
                                                        <Edit className="size-4 text-muted-foreground hover:text-primary" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit User</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <label className="text-sm font-medium">Name</label>
                                                            <Input
                                                                value={editingUser?.name || ''}
                                                                onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <label className="text-sm font-medium">Email</label>
                                                            <Input
                                                                value={editingUser?.email || ''}
                                                                onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <label className="text-sm font-medium">Role</label>
                                                            <Select
                                                                value={editingUser?.profile.role}
                                                                onValueChange={(val: any) => setEditingUser(prev => prev ? { ...prev, profile: { ...prev.profile, role: val } } : null)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="admin">Admin</SelectItem>
                                                                    <SelectItem value="manager">Manager</SelectItem>
                                                                    <SelectItem value="member">Member</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <label className="text-sm font-medium">Location</label>
                                                            <Select
                                                                value={editingUser?.profile.location}
                                                                onValueChange={(val: any) => setEditingUser(prev => prev ? { ...prev, profile: { ...prev.profile, location: val } } : null)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="america">America</SelectItem>
                                                                    <SelectItem value="india">India</SelectItem>
                                                                    <SelectItem value="both">Both</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                                                        <Button onClick={handleUpdate} disabled={isUpdating}>
                                                            {isUpdating ? 'Updating...' : 'Save Changes'}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleDelete(user.id)}
                                                disabled={isDeleting === user.id}
                                            >
                                                {isDeleting === user.id ? (
                                                    <Spinner className="size-4" />
                                                ) : (
                                                    <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
