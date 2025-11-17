import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Collection",
      content: "We collect minimal data necessary to provide our services, including email, projects, and usage analytics."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      content: "All data is encrypted at rest and in transit. API keys are stored with AES-256 encryption."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Data Usage",
      content: "Your data is never sold. We use it only to improve EDITH and provide you with the best coding experience."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Your Rights",
      content: "You have the right to access, modify, or delete your data at any time through your account settings."
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
                Privacy Policy
              </CardTitle>
              <p className="text-gray-400 mt-2">Last updated: January 2025</p>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-300">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all"
                >
                  <div className="text-cyan-400">{section.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{section.title}</h3>
                    <p className="text-gray-400">{section.content}</p>
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