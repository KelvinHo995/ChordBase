import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Lock, Unlock, ArrowLeft } from "lucide-react"
import { UserService } from "@/services/BackendService"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const UserManagement = () => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  const handleLockToggle = (user) => {
    user.status = user.status === "active" ? "locked" : "active";
    try{
      UserService.updateStatus(user.user_id, user);
      setAllUsers(prevUsers => prevUsers.map(u => u.user_id === user.user_id ? {...u, status: user.status} : u));
    }
    catch(err){
      console.error("Failed to update user status:", err);
    }
  }

  const handleRoleChange = (user, newRole) => {
    user.role = newRole;
    try{
      UserService.updateRole(user.user_id, user);
      setAllUsers(prevUsers => prevUsers.map(u => u.user_id === user.user_id ? {...u, role: newRole} : u));
    } catch(err){
      console.error("Failed to update user role:", err);
    }
  }

  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await UserService.getAll();
      console.log(users);
      setAllUsers(users.data.users);
    };
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="cursor-pointer mb-6 gap-2 text-lg -ml-4 print:hidden">
        <ArrowLeft className="h-5 w-5" />
        Back
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        </div>
        <p className="mt-2 text-muted-foreground">Manage user accounts, roles, and permissions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>{allUsers.length} users registered on ChordBase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.display_name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.display_name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.display_name}</p>
                          <p className="text-xs text-muted-foreground">@{user.display_name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Select value={user.role} onValueChange={(value) => handleRoleChange(user, value)}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>
                        {user.status === "active" ? "Active" : "Locked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(user.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={e => handleLockToggle(user)} variant="outline" size="sm" className="gap-1 bg-transparent">
                        {user.status !== "active" ? (
                          <>
                            <Unlock className="h-3 w-3" />
                            Unlock
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3" />
                            Lock
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserManagement