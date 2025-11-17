import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
  const [, setLocation] = useLocation();

  const terms = [
    {
      title: "Acceptance of Terms",
      content: "By accessing EDITH, you agree to be bound by these terms and conditions."
    },
    {
      title: "Use License",
      content: "We grant you a limited, non-exclusive license to use EDITH for personal and commercial projects."
    },
    {
      title: "User Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account and all activities under your account."
    },
    {
      title: "Service Modifications",
      content: "We reserve the right to modify or discontinue services at any time without prior notice."
    },
    {
      title: "Limitation of Liability",
      content: "EDITH is provided 'as is' without warranties. We are not liable for any damages arising from use of our service."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Button
          variant="ghost"
          onClick={() => setLocation("/auth")}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="bg-gray-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Terms & Conditions
              </CardTitle>
              <p className="text-gray-400 mt-2">Effective Date: January 2025</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {terms.map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{term.title}</h3>
                      <p className="text-gray-400">{term.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}