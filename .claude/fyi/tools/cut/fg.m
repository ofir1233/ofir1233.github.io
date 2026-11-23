#import <Foundation/Foundation.h>
#import <Vision/Vision.h>
#import <CoreImage/CoreImage.h>
@interface NSObject (VNDyn)
- (NSIndexSet*)allInstances;
- (CVPixelBufferRef)generateScaledMaskForImageForInstances:(NSIndexSet*)i fromRequestHandler:(VNImageRequestHandler*)h error:(NSError**)e;
@end
static CIContext *ctx;
static void save(CVPixelBufferRef pb, NSString *p){
  CIImage *im=[CIImage imageWithCVPixelBuffer:pb];
  CGColorSpaceRef cs=CGColorSpaceCreateWithName(kCGColorSpaceLinearGray);
  NSError *e=nil;
  [ctx writePNGRepresentationOfImage:im toURL:[NSURL fileURLWithPath:p] format:kCIFormatL8 colorSpace:cs options:@{} error:&e];
  if(e) NSLog(@"%@",e);
}
int main(int argc,char**argv){@autoreleasepool{
  ctx=[CIContext context];
  NSString *path=[NSString stringWithUTF8String:argv[1]], *out=[NSString stringWithUTF8String:argv[2]];
  CIImage *ci=[CIImage imageWithContentsOfURL:[NSURL fileURLWithPath:path]];
  VNImageRequestHandler *h=[[VNImageRequestHandler alloc] initWithCIImage:ci options:@{}];
  NSError *e=nil;
  for(NSString *cn in @[@"VNGenerateForegroundInstanceMaskRequest",@"VNGeneratePersonInstanceMaskRequest"]){
    Class c=NSClassFromString(cn);
    if(!c){NSLog(@"no class %@",cn);continue;}
    VNRequest *r=[[c alloc] init];
    [h performRequests:@[r] error:&e];
    if(e){NSLog(@"%@",e);e=nil;continue;}
    id obs=r.results.firstObject;
    if(!obs){NSLog(@"%@ no result",cn);continue;}
    NSIndexSet *all=[obs allInstances];
    NSLog(@"%@ instances %lu",cn,(unsigned long)all.count);
    [all enumerateIndexesUsingBlock:^(NSUInteger i,BOOL*stop){
      NSError *ee=nil;
      CVPixelBufferRef pb=[obs generateScaledMaskForImageForInstances:[NSIndexSet indexSetWithIndex:i] fromRequestHandler:h error:&ee];
      if(pb) save(pb,[NSString stringWithFormat:@"%@/%@-%lu.png",out,cn,(unsigned long)i]); else NSLog(@"%@",ee);
    }];
  }
  VNGeneratePersonSegmentationRequest *p=[[VNGeneratePersonSegmentationRequest alloc] init];
  p.qualityLevel=VNGeneratePersonSegmentationRequestQualityLevelAccurate;
  p.outputPixelFormat=kCVPixelFormatType_OneComponent8;
  [h performRequests:@[p] error:&e];
  VNPixelBufferObservation *o=p.results.firstObject;
  if(o) save(o.pixelBuffer,[out stringByAppendingString:@"/person.png"]);
}return 0;}
