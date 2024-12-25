"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <CardContainer className="inter-var">
          <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              Play chess against the world
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <Image
                src="https://images.unsplash.com/photo-1632137366039-ba08c5ed24d3?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                height="1000"
                width="1000"
                className="w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </CardItem>
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 mt-12 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
            >
              Sign up
            </CardItem>
          </CardBody>
        </CardContainer>

        <div className="flex justify-center items-center">
          Login
        </div>
      </div>

    </>
  );
}
