
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthContext } from '@/context/authContext'
import { writeAuthSession } from '@/lib/authSession'

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
})

export function SuperAdminSignIn() {
  const router = useNavigate();
  const { setAuthUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

 const onSubmit = async(values: z.infer<typeof formSchema>)=> {

    try {
      setIsLoading(true)
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/superAdmin/signin`,{
        email: values.email,
        password: values.password
      },{
        withCredentials: true
      })
      const session = { role: "superadmin" as const, email: values.email };
      writeAuthSession(session);
      setAuthUser(session);
      toast.success("Welcome back");
      router('/superadmin/addAdmin')
    } catch (error) {
      toast.error("Could not sign in as super admin");
    }finally{
      setIsLoading(false);
    }

  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-md items-center">
      <Card className="w-full shadow-sm">
        <CardHeader className="space-y-1 items-center">
        <ShieldCheck className='h-20 w-20'/>
          <CardTitle className="text-2xl font-bold text-center">Super Admin</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Enter your email" {...field} className="pl-10" />
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          className="pl-10 pr-10"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <div
                        //   type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1 text-muted-foreground bg-background p-1 m-0 hover:cursor-pointer" 
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* <CardFooter className="flex justify-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </CardFooter> */}
      </Card>
    </div>
  )
}
