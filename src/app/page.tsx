import { SignedIn, SignedOut,SignOutButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <SignedOut>
        <SignUpButton mode="modal">Sign UP</SignUpButton>
      </SignedOut>
    
      <SignedIn>
        <SignOutButton>Logout</SignOutButton>
      </SignedIn>
    </div>
  );
}
