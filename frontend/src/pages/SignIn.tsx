import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/authContext";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";


const FormSchema = z.object({
  pin: z.string().length(6, {
    message: "Your one-time password must be exactly 6 characters.",
  }),
});

export default function AdminSignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const { setAuthUser } = useAuthContext();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  
  const onSubmit = async(data: z.infer<typeof FormSchema>) => {

    try{
    const res = await axios.post("http://localhost:8000/api/user/auth/signin/verify",{
      email,
      otp: data.pin
    },{
      withCredentials:true
    })
    localStorage.setItem("cloud-IDE", JSON.stringify(res));
      setAuthUser(res);
      toast.success(`OTP Submitted: ${data.pin}`);
      navigate("/problems");
  }catch{
      toast.error("Invalid OTP or OTP expired");
      window.location.reload();
    }
  };

  // Handle sending OTP
  const handleSendOTP = async(e: React.FormEvent) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:8000/api/user/auth/signin",{
      email
    },{
      withCredentials:true,
    })

    if(res.status === 200){
      setShowOTP(true);
      toast.success("OTP sent to your email.");
    }
    else{
      toast.success("there was some problem sending the OTP");
    }
    
  };

  return (
    <div className="container mx-auto flex h-[80vh] max-w-md items-center">
      <Card className="w-full p-8">
        <div className="mb-8 text-center">
          <Code2 className="mx-auto h-12 w-12" />
          <h1 className="mt-4 text-2xl font-semibold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {!showOTP ? (
          // Email input form
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send OTP
            </Button>
          </form>
        ) : (
          // OTP input form
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
