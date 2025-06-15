import React from "react";

import Title from "./Title";

import Star from "/public/icons/star.svg"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Main = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Title />
        </CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui ullam nostrum magnam ipsa at voluptates fugiat laudantium, molestias omnis repudiandae. Magnam minus in quisquam esse soluta blanditiis atque commodi facilis.
        </CardDescription>
        <CardAction>
          <Star></Star>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}

export default Main;