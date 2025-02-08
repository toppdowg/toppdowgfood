import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { useSession, signOut } from "next-auth/react";
import { sendEmail } from "@/utils/emailService";
import Head from "next/head";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home() {
  const { data: session } = useSession();
  const [dogs, setDogs] = useState([]);
  const [dogInfo, setDogInfo] = useState({ name: "", breed: "", age: "", weight: "", dietaryNeeds: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode) setDarkMode(JSON.parse(storedMode));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", JSON.stringify(!prev));
      return !prev;
    });
  };

  const calculateDiet = (weight, age) => {
    let multiplier = age < 1 ? 0.05 : 0.025; // Puppies need more food
    const dailyFoodAmount = weight * multiplier;
    return dailyFoodAmount.toFixed(2);
  };

  const handleAddDog = (e) => {
    e.preventDefault();
    const recommendedFood = calculateDiet(dogInfo.weight, dogInfo.age);
    setDogs([...dogs, { ...dogInfo, recommendedFood }]);
    setLoyaltyPoints(loyaltyPoints + 10); // Reward points for adding a dog
    setDogInfo({ name: "", breed: "", age: "", weight: "", dietaryNeeds: "" });
    sendEmail(session?.user?.email, "Dog Profile Added", `Your dog's profile has been added successfully! Recommended daily food: ${recommendedFood} lbs.`);
  };

  return (
    <div className={darkMode ? "min-h-screen bg-gray-900 text-white" : "min-h-screen bg-gray-100 text-gray-900"}>
      <Head>
        <title>ToppDawg Food - Raw Dog Food Subscription</title>
        <meta name="description" content="Get the best biologically appropriate raw dog food for your pet. Custom meal plans available." />
        <meta name="keywords" content="raw dog food, biologically appropriate, pet nutrition, dog meals" />
      </Head>

      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ToppDawg Food</h1>
        <ul className="flex gap-6">
          <li><a href="#home" className="hover:text-yellow-600">Home</a></li>
          <li><a href="#plans" className="hover:text-yellow-600">Plans</a></li>
          <li><a href="#about" className="hover:text-yellow-600">About</a></li>
          <li><a href="#contact" className="hover:text-yellow-600">Contact</a></li>
          {session ? (
            <li>
              <Link href="/dashboard" className="hover:text-yellow-600">Dashboard</Link>
            </li>
          ) : (
            <li>
              <Link href="/login" className="hover:text-yellow-600">Login</Link>
            </li>
          )}
        </ul>
        <Button onClick={toggleDarkMode} className="ml-4 bg-gray-800 text-white px-4 py-2 rounded-lg">{darkMode ? "Light Mode" : "Dark Mode"}</Button>
      </nav>
      
      <header className="text-center py-20 bg-yellow-500 text-white">
        <h2 className="text-4xl font-bold">Biologically Appropriate Raw Dog Food</h2>
        <p className="mt-4">Give your dog the nutrition they deserve</p>
        <Button className="mt-6 bg-white text-yellow-600 px-6 py-2 rounded-lg">Get Started</Button>
      </header>

      {session && (
        <section id="dashboard" className="py-12 px-6 text-center bg-gray-200">
          <h3 className="text-3xl font-bold">User Dashboard</h3>
          <p className="mt-4">Manage your dogs, subscriptions, and orders.</p>
          <p className="mt-4">Loyalty Points: {loyaltyPoints}</p>
          <Link href="/manage-dogs" className="block mt-4 text-yellow-600">Manage Dogs</Link>
          <Link href="/subscriptions" className="block mt-2 text-yellow-600">Manage Subscriptions</Link>
          <Link href="/order-tracking" className="block mt-2 text-yellow-600">Track Orders</Link>
        </section>
      )}

      <footer className="py-6 bg-gray-900 text-white text-center">
        <p>&copy; 2025 ToppDawg Food. All rights reserved.</p>
      </footer>
    </div>
  );
}"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
"dependencies": {
  "next": "^13.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
