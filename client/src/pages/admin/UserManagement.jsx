import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Lock, Unlock } from "lucide-react"

const SAMPLE_USERS = [
  {
    id: "1",
    username: "johndoe",
    displayName: "John Doe",
    email: "john@example.com",
    role: "admin",
    locked: false,
    avatar: "/placeholder-user.jpg",
    joinDate: "2024-01-01",
  },
  {
    id: "2",
    username: "janedoe",
    displayName: "Jane Doe",
    email: "jane@example.com",
    role: "user",
    locked: false,
    avatar: "/placeholder-user.jpg",
    joinDate: "2024-01-15",
  },
  {
    id: "3",
    username: "mikewilson",
    displayName: "Mike Wilson",
    email: "mike@example.com",
    role: "user",
    locked: false,
    avatar: "/placeholder-user.jpg",
    joinDate: "2024-02-01",
  },
  {
    id: "4",
    username: "sarahbrown",
    displayName: "Sarah Brown",
    email: "sarah@example.com",
    role: "user",
    locked: true,
    avatar: "/placeholder-user.jpg",
    joinDate: "2024-01-20",
  },
]

const UserManagement = () => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
          <CardDescription>{SAMPLE_USERS.length} users registered on ChordBase</CardDescription>
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
                {SAMPLE_USERS.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.displayName?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Select value={user.role}>
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
                      <Badge variant={user.locked ? "destructive" : "default"}>
                        {user.locked ? "Locked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(user.joinDate)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        {user.locked ? (
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