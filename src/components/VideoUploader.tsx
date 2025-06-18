
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoUploaderProps {
  onVideoChange: (videoUrl: string) => void;
  initialVideoUrl?: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoChange, initialVideoUrl }) => {
  const [videoUrl, setVideoUrl] = useState<string>(initialVideoUrl || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { toast } = useToast();

  // For now, we'll use a simple URL input instead of actual file upload
  // since we don't have a backend to handle file uploads
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    onVideoChange(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        // In a real implementation, we'd upload the file to a server
        // For now, we'll simulate this by creating an object URL
        simulateUpload(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a video file.",
          variant: "destructive"
        });
      }
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    
    // Create a temporary URL for the video
    const tempUrl = URL.createObjectURL(file);
    
    // Simulate upload delay
    setTimeout(() => {
      setVideoUrl(tempUrl);
      onVideoChange(tempUrl);
      setIsUploading(false);
      toast({
        title: "Video uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="video-file">Upload Course Video</Label>
        <div className="flex items-center gap-2">
          <Input
            id="video-file"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="flex-1"
            disabled={isUploading}
          />
          <Button 
            variant="outline" 
            size="icon" 
            disabled={isUploading || !videoFile}
            className="flex-none"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload a video file (MP4, WebM, etc.)
        </p>
      </div>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="video-url">Or provide a video URL</Label>
        <Input
          id="video-url"
          type="url"
          placeholder="https://example.com/video.mp4"
          value={videoUrl}
          onChange={handleUrlChange}
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">
          Provide a direct URL to the video file or YouTube/Vimeo URL
        </p>
      </div>

      {videoUrl && !videoUrl.startsWith('blob:') && (
        <div className="mt-4 border rounded-md p-4">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <video
            src={videoUrl}
            controls
            className="w-full aspect-video rounded-md bg-black"
            poster={initialVideoUrl ? undefined : "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {videoUrl && videoUrl.startsWith('blob:') && (
        <div className="mt-4 border rounded-md p-4">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <video
            src={videoUrl}
            controls
            className="w-full aspect-video rounded-md bg-black"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
