"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import faqs from "@/data/faqs.json";
import workflowSteps from "@/data/workFlowSteps.json";
import features from "@/data/features";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <section className="container mx-auto py-50 text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold  pb-6 flex flex-col">
            Streamline Your Workflow <br />
            <span className="flex mx-auto gap-3 sm:gap-4 items-center">
              with
            </span>
          </h1>

          {/* Blurry Glass Box */}
          <div className="relative max-w-5xl mx-auto group">
            {/* Glass Box with Shooting Star */}
            <div className="relative z-10 backdrop-blur-xl  dark:bg-white/5 border border-gray dark:border-white/10 rounded-3xl px-8 py-12 shadow overflow-hidden shooting-star-box">
              <p className="text-6xl sm:text-7xl font-bold tracking-tight text-purple-500">
                Pl<span className=" text-black dark:text-white ">a</span>n{" "}
                <span className="">Lab</span>
              </p>
            </div>
          </div>
          <p className="text-md text-gray-300 mt-8 mb-3 max-w-3xl mx-auto">
            Empower your team with our intuitive project management solution.
          </p>

          <Link href="/onboarding">
            <Button size="lg" className="mr-4 cursor-pointer">
              Get Started <ChevronRight size={18} className="ml-1" />
            </Button>
          </Link>

          <Link href="#features">
            <Button size="lg" variant="outline" className="cursor-pointer">
              Learn More
            </Button>
          </Link>
        </section>
        {/* Features Section */}
        <section id="features" className=" py-30 px-5">
          <div className="container mx-auto">
            <p className="text-3xl font-bold tracking-tight text-purple-500 mb-12 text-center">
              Key <span className="dark:text-white text-black ">Features</span>{" "}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/5">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 mb-4 text-purple-600" />
                    <h4 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="dark:text-gray-500 text-gray-500 ">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* Steps Carousel */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center">
              How to <span className="text-purple-600">use?</span>
            </h3>
            <Carousel className="w-full py-10 ">
              <CarouselContent className="flex items-center gap-2 sm:gap-3  ">
                {workflowSteps.map(({ title, id, description }) => (
                  <CarouselItem
                    key={id}
                    className="basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <div className="w-full max-w-xs  h-full min-h-[200px]  rounded-xl shadow-md p-6 flex flex-col justify-center bg-white/5">
                      <p className="text-lg font-semibold">{title}</p>
                      <p className="text-gray-500 mt-2 text-sm">
                        {description}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
        {/* FAQ Section */}
        <section className=" py-20 px-5">
          <div className="relative">
            <div className="absolute top-1/2 right-20 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 blur-3xl rounded-full z-0 "></div>

            <div className="container mx-auto">
              <h3 className="text-3xl font-bold mb-12 text-center">
                Frequently <span className="text-purple-600">Asked</span>{" "}
                Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="cursor-pointer">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 text-center px-5">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-2">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-xl mb-12 text-gray-400">
              Start using Plan Lab to simplify your projects and boost
              productivity.
            </p>
            <Link href="/onboarding">
              <Button
                size="lg"
                className="animate-bounce bg-purple-600 dark:text-white cursor-pointer"
              >
                Start For Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
