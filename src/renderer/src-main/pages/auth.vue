<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@renderer/shared/components/ui/card'
import { Label } from '@renderer/shared/components/ui/label'
import { Input } from '@renderer/shared/components/ui/input'
import { Button } from '@renderer/shared/components/ui/button'
</script>

<template>
  <div class="w-full h-full">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription> Enter your email below to login to your account </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div class="flex flex-col gap-6">
            <div class="grid gap-2">
              <Label html-for="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="grid gap-2">
              <div class="flex items-center">
                <Label html-for="password">Password</Label>
                <a href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex-col gap-2">
        <Button type="submit" class="w-full"> Login </Button>
        <Button variant="outline" class="w-full"> Login with Google </Button>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="#" class="underline underline-offset-4"> Sign up </a>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
