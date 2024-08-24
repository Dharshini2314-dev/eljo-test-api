import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { IEmployeeService } from './employee/interface/employee.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { departmentmaster, employee, user } from './employee/dbentity/employee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { authLogin, emplTable, newemployee } from './employee/dto/employee.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

export class EmployeeService implements IEmployeeService {
  secret = 'JWT_SECRET';
  expiresIn = '24h';
  constructor(
    private jwtService: JwtService,
    @InjectRepository(departmentmaster)
    private readonly departmentRepository: Repository<departmentmaster>,

    @InjectRepository(employee)
    private readonly employeeRepository: Repository<employee>,
    @InjectRepository(user)
    private readonly userRepository: Repository<user>,
    private readonly mailerService: MailerService,
  
  ) { }

  private extension = {
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
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
      'dotx',
    'application/vnd.ms-word.document.macroEnabled.12': 'docm',
    'application/vnd.ms-word.template.macroEnabled.12': 'dotm',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
      'xltx',
    'application/vnd.ms-excel.sheet.macroEnabled.12': 'xlsm',
    'application/vnd.ms-excel.template.macroEnabled.12': 'xltm',
    'application/vnd.ms-excel.addin.macroEnabled.12': 'xlam',
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12': 'xlsb',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      'pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.template':
      'potx',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
      'ppsx',
    'application/vnd.ms-powerpoint.addin.macroEnabled.12': 'ppam',
    'application/vnd.ms-powerpoint.presentation.macroEnabled.12': 'pptm',
    'application/vnd.ms-powerpoint.slideshow.macroEnabled.12': 'ppsm',
  }

  async department_list(id: number): Promise<any> {
    try {
      const data = await this.departmentRepository.find();
      return { msg: 'Test Success', data: data };

    } catch (e) {
      console.log(e, ' error');
      throw new HttpException(
        { message: 'Internal Server Error.' + e },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async new_employee(dto: newemployee): Promise<any> {
    try {
      
      const empDb = await this.employeeRepository
      .createQueryBuilder('employee')
      .select([
        'employee.employeeId',
        'employee.employeecode',
        'employee.firstname',
        'employee.lastname',
        'employee.departmentId',
        'employee.email',
        'employee.mobile',
      ])
      .where('employee.employeecode = :employeecode', { employeecode: dto.employee_code })
      .getOne();
      console.log(empDb,' empdb');
      const pwd=await this.encryptPassword(dto.userName);
      if (empDb == null) {
        const userTbl = new user();
        userTbl.username = dto.userName;
        userTbl.password = pwd;
        const usrSave = await this.userRepository.save(userTbl);

        const empTbl = new employee();
        empTbl.departmentId = dto.departmentId;
        empTbl.email = dto.email;
        empTbl.employeecode = dto.employee_code;
        empTbl.firstname = dto.first_name;
        empTbl.lastname = dto.lastname;
        empTbl.mobile = dto.mobile;
        empTbl.userId = usrSave.userId;

        const empSave = await this.employeeRepository.save(empTbl);
        const body='user name :'+dto.userName +' Password:'+dto.userName;
        this.newEmail(dto.email,'inihsrahdovn41@gmail.com','User Created','',null,body);
      
      } else {

        await this.userRepository.update({userId:empDb.userId},{username:dto.userName,password:pwd});

        await this.employeeRepository.update({employeeId:empDb.employeeId},
          {
            firstname:dto.first_name,
            lastname:dto.lastname,
            employeecode:dto.employee_code,
            email:dto.email,
           departmentId:dto.departmentId,
           mobile:dto.mobile,
           
          }
        )

      }
      return { msg: 'Employee Success',status:true };

    } catch (e) {
      console.log(e, ' error');
     
      throw new HttpException(
        { message: 'Internal Server Error.' + e },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async profile_update(dto: newemployee): Promise<any> {
    try {
      
      const empDb = await this.employeeRepository
      .createQueryBuilder('employee')
      .select([
        'employee.employeeId',
        'employee.employeecode',
        'employee.firstname',
        'employee.lastname',
        'employee.departmentId',
        'employee.email',
        'employee.mobile',
        'employee.profileUrl',
      ])
      .where('employee.employeecode = :employeecode', { employeecode: dto.employee_code })
      .getOne();
      console.log(empDb,' empdb');
    
      if (empDb != null) {
    
        const image_path =  dto.employee_code + '/profile';

      if (dto.profileImage != null) {
        const sfilename = '/'+ dto.employee_code +'_prfile_' +Math.floor(new Date().getTime() / 1000);
        const extension = await this.decodeBase64Image(dto.profileImage);
    
          const url = '/uploads/' + image_path + sfilename + '.' + extension;
          const location = path.join(__dirname, '../uploads/' + image_path);
          const status = await this.imageUpload(
            dto.profileImage,
            location,
            sfilename,
          );
          dto.profileImage = url;
       
     

     
        
        
      
      }

     //   await this.userRepository.update({userId:empDb.userId},{username:dto.userName,password:pwd});

        await this.employeeRepository.update({employeeId:empDb.employeeId},
          {
            firstname:dto.first_name,
            lastname:dto.lastname,
            employeecode:dto.employee_code,
            email:dto.email,
           departmentId:dto.departmentId,
           mobile:dto.mobile,
           profileUrl:dto.profileImage
          }
        )

      }
      return { msg: 'Employee Success',status:true };

    } catch (e) {
      console.log(e, ' error');
     
      throw new HttpException(
        { message: 'Internal Server Error.' + e },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetch_employee(dto: emplTable): Promise<any> {
    try {
      const params='CALL GetEmployeeDetails(?, ?, ?, ?, ?, ?)';
      const data=[dto.searchTerm,dto.department_id, dto.sortColumn,dto.sortOrder,dto.pageNumber,dto.pageSize]
      const empDb = await this.employeeRepository.query(params,data);
    
      return { msg: 'Employee Success',status:true,data:empDb[0] };

    } catch (e) {
      console.log(e, ' error');
     
      throw new HttpException(
        { message: 'Internal Server Error.' + e },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async auth_login(dto: authLogin): Promise<any> {
    try {
   
      const userDb = await this.userRepository.findOne({where:{username:dto.username}});
      var pwd = bcrypt.compareSync(dto.password, userDb.password);
      if(pwd)
      {
        const empDb = await this.employeeRepository
        .createQueryBuilder('employee')
        .select([
          'employee.employeeId',
          'employee.employeecode',
          'employee.firstname',
          'employee.lastname',
          'employee.departmentId',
          'employee.email',
          'employee.mobile',
          'employee.profileUrl'
        ])
        .where('employee.userId = :userId', { userId: userDb.userId })
        .getOne();
       const token= this.generateJWT(empDb);
       return { msg: 'Login Success',status:true,data:empDb,token:token };
      }
      return { msg: 'Login Failed',status:false,data:[],token:null };

    } catch (e) {
      console.log(e, ' error');
     
      throw new HttpException(
        { message: 'Internal Server Error.' + e },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async delete_employee(id: number): Promise<any> {
    try {

      const employee = await this.employeeRepository.findOne({where:{employeeId:id}});
      if (employee) {
        // Delete user
        await this.userRepository.delete({ userId: employee.userId });

        // Delete employee
        await this.employeeRepository.delete({ userId: employee.userId });
        return {msg:'Successfull deleted'};
      } else {
        throw new Error('Employee not found');
      }
   

    } catch (e) {
      console.log(e, ' error');
      throw new HttpException(
        { message: 'Internal Server Error.' + e },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public generateJWT(data: any) {
    return this.jwtService.sign(
      { data },
      {
        expiresIn: this.expiresIn,
        secret: this.secret,
      },
    );
  }

  async newEmail(
    to: any,
    from: any,
    subject: any,
    html: any,
    cc: any,
    text: any,
  ) {
    
    try {
      return await this.mailerService.sendMail({
        to: to,
        from: from,
        subject: subject,
        text: text,
        html: html,
      });
    } catch (e) {
      console.log(e, 'email error');
    }
    
  }
  async decodeBase64Image(dataString) {
    //  //console.log(dataString,"dataString");
    if (dataString) {
      const imageTypeRegularExpression = /\/(.*?)$/;
      //var matches = dataString.match(/^data:([A-Za-z-+.\/]+);base64,(.+)$/);
      const matches = dataString.match(
        /^data:([A-Za-z-+.0-9\/]+);base64,(.+)$/,
      );
      const response = { type: '', data: '' };
      // //console.log(matches.length,"matches")
      ////console.log("matches :",matches);
      if (matches && matches.length !== 3) {
        return new Error('Invalid input string');
      } else {
        response.type = matches[1];
        // response.data = new Buffer.from(matches[2], 'base64');
        const imgType = response.type.match(imageTypeRegularExpression);
        const ext = this.extension[imgType['input']];
        return ext;
      }
    }
  }
  async imageUpload(dataString, file_path, filename) {
    const status = false;
    if (dataString) {
      const imageTypeDetected = await this.decodeBase64Image(dataString);
      let base64Data = '';
      base64Data = dataString.split(',')[1];
      const options = { width: 100, height: 100, responseType: 'base64' };

      try {
        //  file_path=  path.join( file_path,filename);

        console.log(file_path, 'file_path');
        if (!fs.existsSync(file_path)) {
          //const mkdirp = require('mkdirp');
          mkdirp(file_path + '/', (err) => {
            file_path = file_path + filename + '.' + imageTypeDetected;
            fs.writeFileSync(file_path, base64Data, 'base64');
          });
        } else {
          // file_path = file_path + filename + '.' + imageTypeDetected;
          file_path = file_path + filename + '.' + imageTypeDetected;
          fs.writeFileSync(file_path, base64Data, 'base64');
        }
      } catch (err) {
        console.error(err);
        return false;
      }
      return true;
    }
  }
  

}


