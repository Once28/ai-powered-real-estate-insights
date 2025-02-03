import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader, Building2, Search, Paperclip, Globe, Mic } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockProperties = {
  "5721 18th Avenue": {
    address: "5721 18th Avenue",
    city: "Brooklyn",
    zoning: "R5",
    landUse: "Mixed Residential & Commercial",
    lotArea: "3,872 sq ft",
    lotFrontage: "38 ft",
    lotDepth: "101.42 ft",
    yearBuilt: 1931,
    buildingClass: "Store Building (K4)",
    numBuildings: 2,
    numFloors: 2,
    gfa: "5,972 sq ft",
    totalUnits: 8,
    residentialUnits: 4,
    records: "View ACRIS",
    zoningDetails: {
      overview: "5721 18th Avenue, Brooklyn, is a mixed-use property zoned R5, ideal for medium-density residential and commercial developments. With a lot area of 3,872 sq ft and a GFA of 5,972 sq ft, the property includes 8 total units (4 residential) and was originally built in 1931 as a Store Building (K4).",
      compliance: "The property at 5721 18th Avenue complies with R5 zoning, which allows medium-density residential and limited commercial use. It offers potential for redevelopment within the 1.25 FAR limit, though vertical expansion and mixed-use upgrades may require variances...",
      permits: {
        description: "To proceed with redevelopment, permits for zoning adjustments, construction, and potentially special variances for mixed-use expansion will be necessary. Below are a list of actionable steps.",
        constraints: [
          "The property is zoned R5, which allows for medium-density residential and limited commercial use. However, the existing structure's use as a store building (K4) may require a variance for any proposed mixed-use redevelopment.",
          "FAR (1.25) limits total buildable area unless additional allowances, such as community facilities or bonuses, are applicable."
        ],
        recommendations: [
          "Apply for a variance early if the proposed development includes non-compliant elements such as exceeding FAR or adding ground-floor retail.",
          "Completing the zoning compliance review, including application and initial feedback, typically takes 3-4 weeks. Allow an additional 4-6 weeks if a variance application is required."
        ]
      }
    }
  }
};

const PropertyDetail = ({ label, value }) => (
  <div className="flex flex-col space-y-1 py-2 border-b border-gray-100 last:border-0">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-base">{value}</dd>
  </div>
);

const PropertyCard = ({ property }) => (
  <Card className="mb-6">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Properties</CardTitle>
      <Button variant="outline" size="sm">Edit</Button>
    </CardHeader>
    <CardContent>
      <div className="space-y-1">
        {Object.entries({
          "Address": property.address,
          "City": property.city,
          "Zoning": property.zoning,
          "Land Use": property.landUse,
          "Lot Area": property.lotArea,
          "Lot Frontage": property.lotFrontage,
          "Lot Depth": property.lotDepth,
          "Year Built": property.yearBuilt,
          "Bldg Class": property.buildingClass,
          "# of Bldgs": property.numBuildings,
          "# of Floors": property.numFloors,
          "GFA": property.gfa,
          "Total Units": property.totalUnits,
          "Res. Units": property.residentialUnits,
          "Records": property.records
        }).map(([label, value]) => (
          <PropertyDetail key={label} label={label} value={value} />
        ))}
      </div>
    </CardContent>
  </Card>
);

const TasksList = ({ permits }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Permits and Approvals</h2>
    <p className="text-gray-600">{permits.description}</p>
    
    <div className="space-y-4">
      <div className="pl-4">
        <h3 className="font-medium mb-2">○ Submit Zoning Compliance Review</h3>
        <div className="pl-4">
          <h4 className="font-medium mb-2">○ Constraints</h4>
          <ul className="list-disc pl-6 space-y-2">
            {permits.constraints.map((constraint, idx) => (
              <li key={idx} className="text-gray-600">{constraint}</li>
            ))}
          </ul>
          
          <h4 className="font-medium mb-2 mt-4">○ Recommendations</h4>
          <ul className="list-disc pl-6 space-y-2">
            {permits.recommendations.map((rec, idx) => (
              <li key={idx} className="text-gray-600">{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default function PropertyChatbot() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      const property = mockProperties[query];
      setResponse(property ? property : { error: "Property not found. Please check the address and try again." });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  Property Information Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter property address (e.g., 5721 18th Avenue)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={loading || !query.trim()} className="min-w-[100px]">
                    {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {response && !response.error && (
              <>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="mb-4">
                    "{query} is zoned R5, perfect for medium-density residential projects. I'll analyze FAR, confirm compliance with overlays or special permits, and check for restrictions or environmental triggers like flood zones. If mixed-use or density bonuses under Inclusionary Housing are viable, I'll uncover them to maximize ROI and ensure seamless compliance."
                  </p>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost"><Mic className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost"><Paperclip className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost">👍</Button>
                    <Button size="icon" variant="ghost">👎</Button>
                    <Button size="icon" variant="ghost">↻</Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">What are common zoning challenges here?</Button>
                  <Button variant="outline">Can you analyze environmental risks now?</Button>
                </div>
              </>
            )}

            {response?.error && (
              <Alert variant="destructive">
                <AlertDescription>{response.error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="summary">
            {response && !response.error && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Property Overview</h2>
                      <p className="text-gray-600">{response.zoningDetails.overview}</p>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Zoning Compliance</h2>
                      <p className="text-gray-600">{response.zoningDetails.compliance}</p>
                      <Button variant="link" className="p-0 h-auto">Read More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tasks">
            {response && !response.error && (
              <Card>
                <CardContent className="p-6">
                  <TasksList permits={response.zoningDetails.permits} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {response && !response.error && <PropertyCard property={response} />}
      </div>
    </div>
  );
}