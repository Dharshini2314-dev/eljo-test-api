import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Query, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { EMPLOYEE_SERVICE, IEmployeeService } from './employee/interface/employee.interface';
import { authLogin, emplTable, newemployee } from './employee/dto/employee.dto';
import * as path from 'path';
import * as fs from 'fs';
import { Response, Request } from 'express';

@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
    constructor(
        @Inject(EMPLOYEE_SERVICE)
        private readonly iEmployeeService: IEmployeeService,
      ) {}

  @UsePipes(new ValidationPipe())

  @Get('department_list/:subsidiary_id')
  public async department_list(
    @Param('subsidiary_id') subsidiary_id: number,
  ): Promise<any> {
    const response = await this.iEmployeeService.department_list(subsidiary_id);
  return response;
  }

  @ApiBody({ type: newemployee })
  @UsePipes(new ValidationPipe())

  @Post('new_employee')
  public async new_employee(@Body() dto: newemployee): Promise<any> {
    const response = await this.iEmployeeService.new_employee(dto);
    return response;
  }

  @ApiBody({ type: emplTable })
  @UsePipes(new ValidationPipe())

  @Post('fetch_employee')
  public async fetch_employee(@Body() dto: emplTable): Promise<any> {
    const response = await this.iEmployeeService.fetch_employee(dto);
    return response;
  }

  @ApiBody({ type: authLogin })
  @UsePipes(new ValidationPipe())
  @Post('login')
  public async auth_login(@Body() dto: authLogin): Promise<any> {
    const response = await this.iEmployeeService.auth_login(dto);
    return response;
  }

  @UsePipes(new ValidationPipe())
   @Get('delete_employee/:id')
   public async delete_employee(
     @Param('id') id: number,
   ): Promise<any> {
     const response = await this.iEmployeeService.delete_employee(id);
   return response;
   }


   @ApiBody({ type: newemployee })
   @UsePipes(new ValidationPipe())
   @Post('profile_update')
   public async profile_update(@Body() dto: newemployee): Promise<any> {
     const response = await this.iEmployeeService.profile_update(dto);
     return response;
   }


   @Get('file_render')
   public async file_render(
     @Query() url: any,
     @Res() res: Response,
     @Req() req: Request,
   ): Promise<any> {
     try {
       const extension = {
         'text/html': 'html',
         'text/css': 'css',
         'text/xml': 'xml',
         'image/gif': 'gif',
         'image/jpeg': 'jpeg',
         'image/jpg': 'jpg',
         'application/x-javascript': 'js',
         'application/atom+xml': 'atom',
         'application/rss+xml': 'rss',
         'text/mathml': 'mml',
         'text/plain': 'txt',
         'text/vnd.sun.j2me.app-descriptor': 'jad',
         'text/vnd.wap.wml': 'wml',
         'text/x-component': 'htc',
         'image/png': 'png',
         'image/tiff': 'tif',
         'image/vnd.wap.wbmp': 'wbmp',
         'image/x-icon': 'ico',
         'image/x-jng': 'jng',
         'image/x-ms-bmp': 'bmp',
         'image/svg+xml': 'svg',
         'image/webp': 'webp',
         'application/java-archive': 'jar',
         'application/mac-binhex40': 'hqx',
         'application/pdf': 'pdf',
         'application/postscript': 'ps',
         'application/rtf': 'rtf',
         'application/vnd.ms-excel': 'xls',
         'application/vnd.ms-powerpoint': 'ppt',
         'application/vnd.wap.wmlc': 'wmlc',
         'application/vnd.google-earth.kml+xml': 'kml',
         'application/vnd.google-earth.kmz': 'kmz',
         'application/x-7z-compressed': '7z',
         'application/x-cocoa': 'cco',
         'application/x-java-archive-diff': 'jardiff',
         'application/x-java-jnlp-file': 'jnlp',
         'application/x-makeself': 'run',
         'application/x-perl': 'pl',
         'application/x-pilot': 'prc',
         'application/x-rar-compressed': 'rar',
         'application/x-redhat-package-manager': 'rpm',
         'application/x-sea': 'sea',
         'application/x-shockwave-flash': 'swf',
         'application/x-stuffit': 'sit',
         'application/x-tcl': 'tcl',
         'application/x-x509-ca-cert': 'der',
         'application/x-xpinstall': 'xpi',
         'application/xhtml+xml': 'xhtml',
         'application/zip': 'zip',
         'application/octet-stream': 'iso',
         'audio/midi': 'mid',
         'audio/mpeg': 'mp3',
         'audio/ogg': 'ogg',
         'audio/x-realaudio': 'ra',
         'video/3gpp': '3gpp',
         'video/mpeg': 'mpeg',
         'video/quicktime': 'mov',
         'video/x-flv': 'flv',
         'video/x-mng': 'mng',
         'video/x-ms-asf': 'asx',
         'video/x-ms-wmv': 'wmv',
         'video/x-msvideo': 'avi',
         'video/mp4': 'm4v',
         'application/msword': 'doc',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'dotx',
         'application/vnd.ms-word.document.macroEnabled.12': 'docm',
         'application/vnd.ms-word.template.macroEnabled.12': 'dotm',
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
         'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'xltx',
         'application/vnd.ms-excel.sheet.macroEnabled.12': 'xlsm',
         'application/vnd.ms-excel.template.macroEnabled.12': 'xltm',
         'application/vnd.ms-excel.addin.macroEnabled.12': 'xlam',
         'application/vnd.ms-excel.sheet.binary.macroEnabled.12': 'xlsb',
         'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
         'application/vnd.openxmlformats-officedocument.presentationml.template': 'potx',
         'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ppsx',
         'application/vnd.ms-powerpoint.addin.macroEnabled.12': 'ppam',
         'application/vnd.ms-powerpoint.presentation.macroEnabled.12': 'pptm',
         'application/vnd.ms-powerpoint.slideshow.macroEnabled.12': 'ppsm',
       };
   
       console.log(url, 'file_name');
   console.log(__dirname,url.url);
       // Ensure `url.url` is defined and correctly formatted
       const filePath = path.join(__dirname,'..',url.url);
       console.log(filePath,' filePath');
       const fileName = path.basename(filePath);
       console.log(filePath, 'file_path');
       console.log(fileName, 'file_name');
   
       if (fs.existsSync(filePath)) {
         const fileSplit = fileName.split('.');
         const fileExtension = fileSplit[fileSplit.length - 1].toLowerCase();
         console.log(fileExtension, 'file_extension');
   
         if (fileExtension !== 'mp4') {
           const readStream = fs.createReadStream(filePath);
   
           function getKeyByValue(object: any, value: any) {
             return Object.keys(object).find(key => object[key] === value);
           }
   
           const fileContentType = getKeyByValue(extension, fileExtension);
   
           if (fileContentType) {
             readStream.on('open', function () {
               res.writeHead(200, {
                 'Content-Disposition': `inline; filename="${fileName}"`,
                 'Content-Type': fileContentType,
               });
               readStream.pipe(res);
             });
   
             readStream.on('error', function (err) {
               res.status(500).send('Error reading file.');
             });
           } else {
             res.status(415).send('Unsupported file type.');
           }
         } else {
           const stat = fs.statSync(filePath);
           const fileSize = stat.size;
           const range = req.headers.range;
   
           if (range) {
             const parts = range.replace(/bytes=/, '').split('-');
             const start = parseInt(parts[0], 10);
             const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
             const chunkSize = end - start + 1;
             const file = fs.createReadStream(filePath, { start, end });
   
             res.writeHead(206, {
               'Content-Range': `bytes ${start}-${end}/${fileSize}`,
               'Accept-Ranges': 'bytes',
               'Content-Length': chunkSize,
               'Content-Type': 'video/mp4',
             });
             file.pipe(res);
           } else {
             res.writeHead(200, {
               'Content-Length': fileSize,
               'Content-Type': 'video/mp4',
             });
             fs.createReadStream(filePath).pipe(res);
           }
         }
       } else {
         res.status(404).send('File not found.');
       }
     } catch (e) {
       console.error(e);
       res.status(500).send('Internal server error.');
     }
   }
}
